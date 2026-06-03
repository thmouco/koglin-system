"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Plus, Loader2, Pencil, Trash2, ArrowLeft, Calendar, DollarSign, UserPlus, Mail, Phone } from 'lucide-react'

interface Project { id: string; name: string; value: number | null; start_date: string | null; end_date: string | null; description: string | null; created_at: string }
interface Contact { id: string; name: string; role: string | null; email: string | null; phone: string | null; whatsapp: string | null }
interface Client {
  id: string; name: string; logo_url: string | null; created_at: string
  contacts: Contact[]
  projects: Project[]
}

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
}

function ClientLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  if (logoUrl) return <img src={logoUrl} alt={name} className="h-16 w-16 object-contain rounded" />
  return (
    <div className="h-16 w-16 bg-[#00204a]/10 text-[#00204a] font-bold text-2xl flex items-center justify-center rounded">
      {initials}
    </div>
  )
}

export function ClientDetailClient({ client: initial }: { client: Client }) {
  const [client, setClient] = useState(initial)
  const [projectOpen, setProjectOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Project form state
  const [pName, setPName] = useState('')
  const [pValue, setPValue] = useState('')
  const [pStart, setPStart] = useState('')
  const [pEnd, setPEnd] = useState('')
  const [pDesc, setPDesc] = useState('')

  // Contact form state
  const [cName, setCName] = useState('')
  const [cRole, setCRole] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cPhone, setCPhone] = useState('')
  const [cWhatsapp, setCWhatsapp] = useState('')

  function openProject(p?: Project) {
    if (p) {
      setEditingProject(p)
      setPName(p.name); setPValue(p.value?.toString() ?? ''); setPStart(p.start_date ?? ''); setPEnd(p.end_date ?? ''); setPDesc(p.description ?? '')
    } else {
      setEditingProject(null)
      setPName(''); setPValue(''); setPStart(''); setPEnd(''); setPDesc('')
    }
    setProjectOpen(true)
  }

  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pName.trim()) return
    setLoading(true)
    const payload = {
      name: pName.trim(),
      value: pValue ? parseFloat(pValue.replace(',', '.')) : null,
      start_date: pStart || null,
      end_date: pEnd || null,
      description: pDesc || null,
      client_id: client.id,
    }

    if (editingProject) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id)
      if (!error) setClient(prev => ({ ...prev, projects: prev.projects.map(p => p.id === editingProject.id ? { ...p, ...payload } : p) }))
    } else {
      const { data, error } = await supabase.from('projects').insert(payload).select().single()
      if (!error && data) setClient(prev => ({ ...prev, projects: [...prev.projects, data] }))
    }
    setLoading(false)
    setProjectOpen(false)
  }

  async function deleteProject(id: string) {
    if (!confirm('Excluir este projeto?')) return
    await supabase.from('projects').delete().eq('id', id)
    setClient(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }))
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cName.trim()) return
    setLoading(true)
    const { data, error } = await supabase.from('client_contacts').insert({
      client_id: client.id,
      name: cName.trim(),
      role: cRole || null,
      email: cEmail || null,
      phone: cPhone || null,
      whatsapp: cWhatsapp || null,
    }).select().single()
    if (!error && data) {
      setClient(prev => ({ ...prev, contacts: [...prev.contacts, data] }))
      setCName(''); setCRole(''); setCEmail(''); setCPhone(''); setCWhatsapp('')
      setContactOpen(false)
    }
    setLoading(false)
  }

  async function deleteContact(id: string) {
    await supabase.from('client_contacts').delete().eq('id', id)
    setClient(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== id) }))
  }

  const totalValue = client.projects.reduce((s, p) => s + (p.value ?? 0), 0)

  return (
    <>
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-6">
        <button onClick={() => router.push('/clients')} className="mt-1 p-1.5 hover:bg-gray-100 rounded transition-colors">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <ClientLogo name={client.name} logoUrl={client.logo_url} />
          <div>
            <h2 className="text-xl font-bold text-[#00204a]">{client.name}</h2>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span>{client.projects.length} projeto{client.projects.length !== 1 ? 's' : ''}</span>
              <span>Carteira: <span className="text-green-700 font-medium">{totalValue > 0 ? formatBRL(totalValue) : '—'}</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Projetos — col 2/3 */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#00204a]">Projetos</h3>
            <Button size="sm" onClick={() => openProject()}><Plus className="h-4 w-4" /> Novo Projeto</Button>
          </div>
          <div className="space-y-3">
            {client.projects.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-10 border bg-white">Nenhum projeto cadastrado.</div>
            )}
            {client.projects.map(p => (
              <div key={p.id} className="bg-white border p-4 hover:border-[#00204a]/20 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#00204a]">{p.name}</div>
                    {p.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {(p.start_date || p.end_date) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(p.start_date)} – {formatDate(p.end_date)}
                        </span>
                      )}
                      {p.value && (
                        <span className="flex items-center gap-1 text-green-700 font-medium">
                          <DollarSign className="h-3 w-3" />
                          {formatBRL(p.value)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openProject(p)} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => deleteProject(p.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contatos — col 1/3 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#00204a]">Contatos</h3>
            <Button size="sm" variant="outline" onClick={() => setContactOpen(true)}>
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {client.contacts.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-6 border bg-white">Nenhum contato.</div>
            )}
            {client.contacts.map(c => (
              <div key={c.id} className="bg-white border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm text-[#00204a]">{c.name}</div>
                    {c.role && <div className="text-xs text-muted-foreground">{c.role}</div>}
                    <div className="mt-1.5 space-y-1">
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          <Mail className="h-3 w-3" /> {c.email}
                        </a>
                      )}
                      {c.phone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {c.phone}
                        </div>
                      )}
                      {c.whatsapp && <WhatsAppButton number={c.whatsapp} showNumber={false} className="inline-flex" />}
                    </div>
                  </div>
                  <button onClick={() => deleteContact(c.id)} className="p-1 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project modal */}
      <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProjectSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Nome do Projeto *</Label>
              <Input value={pName} onChange={e => setPName(e.target.value)} placeholder="Ex: Clube do Milhão" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Data de Início</Label>
                <Input type="date" value={pStart} onChange={e => setPStart(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Data de Fim</Label>
                <Input type="date" value={pEnd} onChange={e => setPEnd(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Valor do Projeto (R$)</Label>
              <Input value={pValue} onChange={e => setPValue(e.target.value)} placeholder="Ex: 450000" type="number" min="0" step="0.01" />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Descrição do projeto..." rows={3} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setProjectOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading || !pName.trim()}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingProject ? 'Salvar' : 'Criar Projeto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Contato</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label>Nome *</Label>
                <Input value={cName} onChange={e => setCName(e.target.value)} placeholder="Nome completo" required />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Cargo / Função</Label>
                <Input value={cRole} onChange={e => setCRole(e.target.value)} placeholder="Ex: Gerente de Eventos" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>E-mail</Label>
                <Input type="email" value={cEmail} onChange={e => setCEmail(e.target.value)} placeholder="email@empresa.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Telefone</Label>
                <Input value={cPhone} onChange={e => setCPhone(e.target.value)} placeholder="+5511..." />
              </div>
              <div className="space-y-1.5">
                <Label>WhatsApp</Label>
                <Input value={cWhatsapp} onChange={e => setCWhatsapp(e.target.value)} placeholder="+5511..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading || !cName.trim()}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Adicionar Contato
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
