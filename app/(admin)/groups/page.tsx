import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { GroupsClient } from './GroupsClient'

export default async function GroupsPage() {
  const supabase = createClient()

  const [{ data: groups }, { data: guides }] = await Promise.all([
    supabase.from('groups').select(`
      *, guide:users!groups_guide_id_fkey(id, full_name),
      passenger_count:passengers(count)
    `).order('name'),
    supabase.from('users').select('id, full_name').eq('role', 'guide').eq('is_active', true).order('full_name'),
  ])

  const formattedGroups = groups?.map(g => ({
    ...g,
    passenger_count: (g.passenger_count as any)?.[0]?.count ?? 0,
  })) ?? []

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Grupos" subtitle="Gerencie os grupos de viagem" user={null as any} />
      <main className="flex-1 p-6">
        <GroupsClient groups={formattedGroups} guides={guides ?? []} />
      </main>
    </div>
  )
}
