import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { ReferenceDataClient } from './ReferenceDataClient'

export default async function ReferenceDataPage() {
  const supabase = createClient()

  const [{ data: airlines }, { data: cruiseLines }, { data: bedTypes }, { data: ticketCategories }, { data: articleCategories }] = await Promise.all([
    supabase.from('airlines').select('*').order('name'),
    supabase.from('cruise_lines').select('*').order('name'),
    supabase.from('bed_types').select('*').order('name'),
    supabase.from('ticket_categories').select('*').order('name'),
    supabase.from('article_categories').select('*').order('name'),
  ])

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Tabelas de Referência" subtitle="Companhias, acomodações e categorias de ticket" user={null as any} />
      <main className="flex-1 p-6">
        <ReferenceDataClient
          airlines={airlines ?? []}
          cruiseLines={cruiseLines ?? []}
          bedTypes={bedTypes ?? []}
          ticketCategories={ticketCategories ?? []}
          articleCategories={articleCategories ?? []}
        />
      </main>
    </div>
  )
}
