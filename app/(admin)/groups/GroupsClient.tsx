"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Pencil, Users, Loader2, Map } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Group {
  id: string; name: string; description?: string
  guide_id?: string; guide?: { id: string; full_name: string }
  passenger_count: number; created_at: string
}
interface Guide { id: string; full_name: string }

interface Props { groups: Group[]; guides: Guide[] }

export function GroupsClient({ groups: initial, guides }: Props) {
  const [groups, setGroups] = useState(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Group | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [guideId, setGuideId] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function openCreate() {
    setEditing(null)
    setName(''); setDescription(''); setGuideId('')
    setOpen(true)
  }

  function openEdit(g: Group) {
    setEditing(g)
    setName(g.name)
    setDescription(g.description ?? '')
    setGuideId(g.guide_id ?? '')
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const payload = { name, description: description || null, guide_id: guideId || null }

    if (editing) {
      const { error } = await supabase.from('groups').update(payload).eq('id', editing.id)
      if (!error) {
        setGroups(groups.map(g => g.id === editing.id ? {
          ...g, ...payload,
          guide: guides.find(gu => gu.id === guideId)
        } : g))
      }
    } else {
      const { data, error } = await supabase.from('groups').insert(payload).select().single()
      if (!error && data) {
        setGroups([...groups, { ...data, passenger_count: 0, guide: guides.find(gu => gu.id === guideId) }])
      }
    }

    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.guide?.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar grupos ou guias..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-72"
          />
          <span className="text-sm text-muted-foreground">{filtered.length} grupos</span>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Grupo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(g => (
          <Card key={g.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#00204a]/10">
                    <Map className="h-4 w-4 text-[#00204a]" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#00204a]">{g.name}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(g.created_at)}</div>
                  </div>
                </div>
                <button onClick={() => openEdit(g)} className="p-1 hover:bg-gray-100 transition-colors">
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              {g.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{g.description}</p>
              )}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{g.passenger_count} passageiros</span>
                </div>
                {g.guide && (
                  <span className="text-[#00204a] font-medium truncate max-w-[120px]">
                    {g.guide.full_name}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            Nenhum grupo encontrado.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Nome do Grupo *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Grupo Rio de Janeiro A" />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição opcional" />
            </div>
            <div className="space-y-1.5">
              <Label>Guia Responsável</Label>
              <Select value={guideId} onValueChange={setGuideId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar guia..." />
                </SelectTrigger>
                <SelectContent>
                  {guides.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? 'Salvar' : 'Criar Grupo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
