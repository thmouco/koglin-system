import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'

export default async function GuideLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.role !== 'guide' && profile.role !== 'admin') redirect('/dashboard')

  // Open tickets for this guide
  const { count } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('guide_id', user.id)
    .in('status', ['open', 'in_progress'])

  return (
    <AppShell user={profile} openTickets={count ?? 0}>
      {children}
    </AppShell>
  )
}
