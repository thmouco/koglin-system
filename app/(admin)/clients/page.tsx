import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { ClientsClient } from './ClientsClient'

export default async function ClientsPage() {
  const supabase = createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select(`
      id, name, logo_url, created_at,
      contacts:client_contacts(id, name, role, email, phone, whatsapp),
      projects(id, name, value, start_date, end_date)
    `)
    .order('name')

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Clientes" subtitle="Gestão de clientes e seus projetos" user={null as any} />
      <main className="flex-1 p-6">
        <ClientsClient clients={clients ?? []} />
      </main>
    </div>
  )
}
