import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { TicketsClient } from '@/components/tickets/TicketsClient'

export default async function TicketsPage() {
  const supabase = createClient()

  const [{ data: tickets }, { data: categories }] = await Promise.all([
    supabase.from('tickets').select(`
      id, category, status, description, created_at, updated_at,
      passenger_whatsapp, resolved_at,
      passenger:passengers!tickets_passenger_id_fkey(first_name, last_name, whatsapp),
      guide:users!tickets_guide_id_fkey(id, full_name),
      group:groups!tickets_group_id_fkey(id, name)
    `).order('created_at', { ascending: false }),
    supabase.from('ticket_categories').select('id, name, color').order('name'),
  ])

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Tickets" subtitle="Todos os tickets de suporte" user={null as any} />
      <main className="flex-1 p-6">
        <TicketsClient tickets={tickets ?? []} categories={categories ?? []} isGuide={false} />
      </main>
    </div>
  )
}
