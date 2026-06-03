import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { KPICards } from '@/components/dashboard/KPICards'
import { GuideRanking } from '@/components/dashboard/GuideRanking'

export default async function DashboardPage() {
  const supabase = createClient()

  // KPIs
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()

  const [
    { count: openCount },
    { count: resolvedToday },
    { data: resolvedTickets },
    { count: unattended },
    { data: allTickets },
    { data: guideStats },
  ] = await Promise.all([
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('tickets').select('*', { count: 'exact', head: true })
      .eq('status', 'resolved').gte('resolved_at', todayStart),
    supabase.from('tickets').select('created_at, resolved_at').eq('status', 'resolved').not('resolved_at', 'is', null),
    supabase.from('tickets').select('*', { count: 'exact', head: true })
      .eq('status', 'open').lt('created_at', twoHoursAgo),
    supabase.from('tickets').select('created_at, status, category, group_id, group:groups!tickets_group_id_fkey(name)').order('created_at', { ascending: true }),
    supabase.from('tickets').select(`
      guide_id, status, created_at, resolved_at,
      guide:users!tickets_guide_id_fkey(full_name),
      group:groups!tickets_group_id_fkey(name)
    `),
  ])

  // Avg resolution time
  let avgResolutionHours = 0
  let sameDayRate = 0
  if (resolvedTickets && resolvedTickets.length > 0) {
    const durations = resolvedTickets.map(t => {
      const created = new Date(t.created_at).getTime()
      const resolved = new Date(t.resolved_at!).getTime()
      return Math.abs((resolved - created) / (1000 * 60 * 60))
    })
    avgResolutionHours = durations.reduce((a, b) => a + b, 0) / durations.length
    sameDayRate = (durations.filter(d => d <= 24).length / durations.length) * 100
  }

  // Per-guide stats
  const guideMap = new Map<string, {
    guide_name: string; group_name: string;
    open: number; resolved: number; durations: number[]; last_at?: string
  }>()

  guideStats?.forEach(t => {
    const gid = t.guide_id
    if (!gid) return
    if (!guideMap.has(gid)) {
      guideMap.set(gid, {
        guide_name: (t.guide as any)?.full_name ?? '—',
        group_name: (t.group as any)?.name ?? '—',
        open: 0, resolved: 0, durations: []
      })
    }
    const entry = guideMap.get(gid)!
    if (t.status === 'open' || t.status === 'in_progress') entry.open++
    if (t.status === 'resolved') {
      entry.resolved++
      if (t.resolved_at) {
        const dur = Math.abs((new Date(t.resolved_at).getTime() - new Date(t.created_at).getTime()) / 3.6e6)
        entry.durations.push(dur)
      }
    }
    if (!entry.last_at || new Date(t.created_at) > new Date(entry.last_at)) {
      entry.last_at = t.created_at
    }
  })

  const ranking = Array.from(guideMap.entries()).map(([id, v]) => ({
    guide_id: id,
    guide_name: v.guide_name,
    group_name: v.group_name,
    open_tickets: v.open,
    resolved_tickets: v.resolved,
    avg_resolution_hours: v.durations.length > 0 ? v.durations.reduce((a, b) => a + b, 0) / v.durations.length : 0,
    last_ticket_at: v.last_at,
  })).sort((a, b) => b.open_tickets - a.open_tickets)

  // Timeline data (last 30 days)
  const timelineMap = new Map<string, { date: string; open: number; resolved: number }>()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    timelineMap.set(key, { date: key, open: 0, resolved: 0 })
  }
  allTickets?.forEach(t => {
    const key = t.created_at.split('T')[0]
    if (timelineMap.has(key)) {
      const entry = timelineMap.get(key)!
      if (t.status === 'open' || t.status === 'in_progress') entry.open++
      else if (t.status === 'resolved') entry.resolved++
    }
  })
  const timelineData = Array.from(timelineMap.values())

  // Category pie data
  const catMap: Record<string, number> = {}
  allTickets?.forEach(t => { catMap[t.category] = (catMap[t.category] ?? 0) + 1 })
  const categoryData = Object.entries(catMap).map(([name, value]) => ({ name, value }))

  // Tickets by group
  const groupMap: Record<string, number> = {}
  allTickets?.forEach(t => {
    const gname = (t as any).group?.name ?? 'Sem grupo'
    groupMap[gname] = (groupMap[gname] ?? 0) + 1
  })
  const byGroupData = Object.entries(groupMap).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0, 10)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Dashboard" subtitle="Visão geral de tickets e operações" user={null as any} />
      <main className="flex-1 p-6 space-y-6">
        <KPICards
          openTickets={openCount ?? 0}
          resolvedToday={resolvedToday ?? 0}
          avgResolutionHours={avgResolutionHours}
          sameDayRate={sameDayRate}
          unattended2h={unattended ?? 0}
        />
        <DashboardCharts
          timelineData={timelineData}
          categoryData={categoryData}
          byGroupData={byGroupData}
          ranking={ranking}
        />
        <GuideRanking ranking={ranking} />
      </main>
    </div>
  )
}
