import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { UsersClient } from './UsersClient'

export default async function UsersPage() {
  const supabase = createClient()
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('full_name')

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Usuários" subtitle="Gerenciar acessos ao sistema" user={null as any} />
      <main className="flex-1 p-6">
        <UsersClient users={users ?? []} />
      </main>
    </div>
  )
}
