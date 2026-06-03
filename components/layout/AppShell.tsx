"use client"
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sidebar } from './Sidebar'
import type { User } from '@/types'

interface AppShellProps {
  user: User
  openTickets?: number
  children: React.ReactNode
}

export function AppShell({ user, openTickets, children }: AppShellProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} openTickets={openTickets} onSignOut={handleSignOut} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
