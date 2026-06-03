import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { KnowledgeBaseClient } from './KnowledgeBaseClient'

export default async function KnowledgeBasePage() {
  const supabase = createClient()
  const [{ data: articles }, { data: articleCategories }] = await Promise.all([
    supabase.from('knowledge_base').select('*').order('category').order('title'),
    supabase.from('article_categories').select('id, name').order('name'),
  ])

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Base de Conhecimento" subtitle="Artigos usados pelo agente de IA Kogi" user={null as any} />
      <main className="flex-1 p-6">
        <KnowledgeBaseClient articles={articles ?? []} articleCategories={articleCategories ?? []} />
      </main>
    </div>
  )
}
