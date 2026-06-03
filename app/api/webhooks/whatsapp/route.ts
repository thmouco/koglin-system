import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendWhatsApp } from '@/lib/twilio'
import { sendTicketNotificationEmail } from '@/lib/resend'
import { runKogiAgent } from '@/lib/ai-agent'

// Twilio sends form-encoded data
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)

    const from = params.get('From') ?? ''    // whatsapp:+5551999...
    const messageBody = params.get('Body') ?? ''

    if (!from || !messageBody) {
      return new NextResponse('OK', { status: 200 })
    }

    // Normalize phone: remove "whatsapp:" prefix for DB storage
    const phone = from.replace('whatsapp:', '')

    const supabase = createAdminClient()

    // 1. Look up or create WhatsApp session
    let { data: session } = await supabase
      .from('whatsapp_sessions')
      .select('*, passenger:passengers!whatsapp_sessions_passenger_id_fkey(*)')
      .eq('passenger_whatsapp', phone)
      .single()

    if (!session) {
      // Try to find passenger by WhatsApp
      const { data: passenger } = await supabase
        .from('passengers')
        .select('*')
        .eq('whatsapp', phone)
        .single()

      const { data: newSession } = await supabase
        .from('whatsapp_sessions')
        .insert({
          passenger_whatsapp: phone,
          passenger_id: passenger?.id ?? null,
          last_interaction: new Date().toISOString(),
        })
        .select('*, passenger:passengers!whatsapp_sessions_passenger_id_fkey(*)')
        .single()

      session = newSession
    } else {
      // Update last interaction
      await supabase
        .from('whatsapp_sessions')
        .update({ last_interaction: new Date().toISOString() })
        .eq('id', session.id)
    }

    const passenger = session?.passenger ?? null

    // 2. Get guide for this passenger's group
    let guide = null
    if (passenger?.group_id) {
      const { data: group } = await supabase
        .from('groups')
        .select('guide:users!groups_guide_id_fkey(*)')
        .eq('id', passenger.group_id)
        .single()
      guide = (group as any)?.guide ?? null
    }

    // 3. Get relevant knowledge base articles
    const { data: knowledgeBase } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('is_active', true)
      .limit(10)

    // 4. Run AI agent
    const agentResult = await runKogiAgent({
      message: messageBody,
      passenger,
      guide,
      knowledgeBase: knowledgeBase ?? [],
    })

    // 5. Create ticket if needed
    let ticketId: string | null = null

    if (agentResult.shouldCreateTicket && passenger) {
      // Check if there's already an open ticket for this conversation
      const { data: existingTicket } = await supabase
        .from('tickets')
        .select('id')
        .eq('passenger_id', passenger.id)
        .in('status', ['open', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!existingTicket) {
        const { data: newTicket } = await supabase
          .from('tickets')
          .insert({
            passenger_id: passenger.id,
            group_id: passenger.group_id,
            guide_id: guide?.id ?? null,
            category: agentResult.category,
            status: 'open',
            description: messageBody,
            passenger_whatsapp: phone,
          })
          .select()
          .single()

        if (newTicket) {
          ticketId = newTicket.id

          // Log initial message from passenger
          await supabase.from('ticket_messages').insert({
            ticket_id: newTicket.id,
            sender: 'passenger',
            content: messageBody,
          })

          // Log AI reply
          await supabase.from('ticket_messages').insert({
            ticket_id: newTicket.id,
            sender: 'agent_ai',
            content: agentResult.reply,
          })

          // Notify guide via WhatsApp
          if (guide?.whatsapp) {
            const passengerName = `${passenger.first_name} ${passenger.last_name}`
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://koglin-system.vercel.app'
            const notif = `🔔 *Novo Ticket #${newTicket.id.slice(0, 8)} — Koglin Viagens*\n\n*Passageiro:* ${passengerName}\n*Categoria:* ${agentResult.category}\n*Problema relatado:* ${messageBody.slice(0, 200)}\n\nAcesse o painel: ${appUrl}/guide/tickets`

            await sendWhatsApp(guide.whatsapp, notif).catch(console.error)
          }

          // Notify guide via email
          if (guide?.email) {
            const passengerName = `${passenger.first_name} ${passenger.last_name}`
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://koglin-system.vercel.app'

            await sendTicketNotificationEmail({
              to: guide.email,
              guideName: guide.full_name,
              passengerName,
              ticketId: newTicket.id,
              category: agentResult.category,
              description: messageBody,
              appUrl,
            }).catch(console.error)
          }

          // Update session with current ticket
          await supabase
            .from('whatsapp_sessions')
            .update({ current_ticket_id: newTicket.id })
            .eq('id', session!.id)
        }
      } else {
        ticketId = existingTicket.id

        // Add message to existing ticket
        await supabase.from('ticket_messages').insert({
          ticket_id: existingTicket.id,
          sender: 'passenger',
          content: messageBody,
        })
        await supabase.from('ticket_messages').insert({
          ticket_id: existingTicket.id,
          sender: 'agent_ai',
          content: agentResult.reply,
        })
      }
    } else if (agentResult.intent === 'question_answered') {
      // Just log the interaction if we have a ticket open
      if (session?.current_ticket_id) {
        await supabase.from('ticket_messages').insert([
          { ticket_id: session.current_ticket_id, sender: 'passenger', content: messageBody },
          { ticket_id: session.current_ticket_id, sender: 'agent_ai', content: agentResult.reply },
        ])
      }
    }

    // 6. Send reply to passenger
    await sendWhatsApp(phone, agentResult.reply)

    // Respond to Twilio with empty TwiML (we already sent the message via API)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { status: 200, headers: { 'Content-Type': 'text/xml' } }
    )
  } catch (err) {
    console.error('WhatsApp webhook error:', err)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { status: 200, headers: { 'Content-Type': 'text/xml' } }
    )
  }
}
