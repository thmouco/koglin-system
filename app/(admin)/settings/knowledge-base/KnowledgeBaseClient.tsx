"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, BookOpen } from 'lucide-react'
import type { KnowledgeBase } from '@/types'

interface ArticleCategory { id: string; name: string }
interface Props { articles: KnowledgeBase[]; articleCategories: ArticleCategory[] }

export function KnowledgeBaseClient({ articles: initial, articleCategories }: Props) {
  const [articles, setArticles] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<KnowledgeBase | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [filterCat, setFilterCat] = useState('all')
  const supabase = createClient()

  function openCreate() {
    setEditing(null); setTitle(''); setCategory(articleCategories[0]?.name ?? ''); setContent(''); setOpen(true)
  }
  function openEdit(a: KnowledgeBase) {
    setEditing(a); setTitle(a.title); setCategory(a.category); setContent(a.content); setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const payload = { title, category, content }
    if (editing) {
      const { error } = await supabase.from('knowledge_base').update(payload).eq('id', editing.id)
      if (!error) setArticles(articles.map(a => a.id === editing.id ? { ...a, ...payload } : a))
    } else {
      const { data, error } = await supabase.from('knowledge_base').insert({ ...payload, is_active: true }).select().single()
      if (!error && data) setArticles([...articles, data])
    }
    setLoading(false); setOpen(false)
  }

  async function toggleActive(a: KnowledgeBase) {
    const { error } = await supabase.from('knowledge_base').update({ is_active: !a.is_active }).eq('id', a.id)
    if (!error) setArticles(articles.map(x => x.id === a.id ? { ...x, is_active: !x.is_active } : x))
  }

  async function deleteArticle(id: string) {
    if (!confirm('Excluir este artigo?')) return
    await supabase.from('knowledge_base').delete().eq('id', id)
    setArticles(articles.filter(a => a.id !== id))
  }

  const filtered = articles.filter(a => filterCat === 'all' || a.category === filterCat)

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {articleCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{filtered.length} artigos</span>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Novo Artigo</Button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground">Nenhum artigo encontrado.</div>}
        {filtered.map(a => (
          <Card key={a.id} className={`transition-opacity ${!a.is_active ? 'opacity-50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-[#00204a]/10 mt-0.5"><BookOpen className="h-4 w-4 text-[#00204a]" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm text-[#00204a]">{a.title}</span>
                      <span className="px-2 py-0.5 text-xs bg-[#00204a]/10 text-[#00204a]">{a.category}</span>
                      {!a.is_active && <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500">Inativo</span>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleActive(a)} className="p-1.5 hover:bg-gray-100 transition-colors" title={a.is_active ? 'Desativar' : 'Ativar'}>
                    {a.is_active ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                  </button>
                  <button onClick={() => openEdit(a)} className="p-1.5 hover:bg-gray-100 transition-colors">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteArticle(a.id)} className="p-1.5 hover:bg-gray-100 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Editar Artigo' : 'Novo Artigo'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Título *</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Título do artigo" />
              </div>
              <div className="space-y-1.5">
                <Label>Categoria *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>{articleCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Conteúdo * <span className="text-muted-foreground font-normal">(o Kogi usará este texto para responder passageiros)</span></Label>
              <Textarea value={content} onChange={e => setContent(e.target.value)} required rows={6} placeholder="Escreva o conteúdo..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? 'Salvar' : 'Criar Artigo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
