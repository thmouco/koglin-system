import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { ClientDetailClient } from './ClientDetailClient'
import { notFound } from 'next/navigation'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: client } = await supabase
    .from('clients')
    .select(`
      id, name, logo_url, created_at,
      contacts:client_contacts(id, name, role, email, phone, whatsapp),
      projects(id, name, value, start_date, end_date, description, created_at)
    `)
    .eq('id', params.id)
    .single()

  if (!client) notFound()

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header
        title={client.name}
        subtitle={`${client.projects?.length ?? 0} projetos · ${client.contacts?.length ?? 0} contatos`}
        user={null as any}
      />
      <main className="flex-1 p-6">
        <ClientDetailClient client={client as any} />
      </main>
    </div>
  )
}
