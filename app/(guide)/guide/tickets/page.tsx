import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { TicketsClient } from '@/components/tickets/TicketsClient'
import { GuideTicketsSummary } from './GuideTicketsSummary'

export default async function GuideTicketsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: tickets }, { data: categories }, { count: openCount }, { count: inProgressCount }, { count: resolvedToday }] = await Promise.all([
    supabase.from('tickets').select(`
      id, category, status, description, created_at, updated_at, resolved_at,
      passenger_whatsapp,
      passenger:passengers!tickets_passenger_id_fkey(first_name, last_name, whatsapp),
      guide:users!tickets_guide_id_fkey(id, full_name),
      group:groups!tickets_group_id_fkey(id, name)
    `).eq('guide_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('ticket_categories').select('id, name, color').order('name'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('guide_id', user!.id).eq('status', 'open'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('guide_id', user!.id).eq('status', 'in_progress'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('guide_id', user!.id).eq('status', 'resolved')
      .gte('resolved_at', new Date(new Date().setHours(0,0,0,0)).toISOString()),
  ])

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Meus Tickets" subtitle="Tickets atribuídos ao seu grupo" user={null as any} />
      <main className="flex-1 p-6 space-y-6">
        <GuideTicketsSummary
          open={openCount ?? 0}
          inProgress={inProgressCount ?? 0}
          resolvedToday={resolvedToday ?? 0}
        />
        <TicketsClient tickets={tickets ?? []} categories={categories ?? []} isGuide={true} guideId={user!.id} />
      </main>
    </div>
  )
}
