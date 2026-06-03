"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Plus, Loader2, Building2, FolderOpen, TrendingUp, Briefcase } from 'lucide-react'

interface Project { id: string; name: string; value: number | null; start_date: string | null; end_date: string | null }
interface Contact { id: string; name: string; role: string | null; email: string | null; phone: string | null; whatsapp: string | null }
interface Client {
  id: string
  name: string
  logo_url: string | null
  created_at: string
  contacts: Contact[]
  projects: Project[]
}

const COLORS = ['#00204a', '#fcb900', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444']

function ClientLogo({ name, logoUrl, size = 'md' }: { name: string; logoUrl: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-9 w-9 text-sm' : size === 'lg' ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-lg'
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  if (logoUrl) return <img src={logoUrl} alt={name} className={`${sizeClass} object-contain rounded`} />
  return (
    <div className={`${sizeClass} bg-[#00204a]/10 text-[#00204a] font-bold flex items-center justify-center rounded flex-shrink-0`}>
      {initials}
    </div>
  )
}

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
}

interface Props { clients: Client[] }

export function ClientsClient({ clients: initial }: Props) {
  const [clients, setClients] = useState(initial)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const totalProjects = clients.reduce((s, c) => s + c.projects.length, 0)
  const totalValue = clients.reduce((s, c) => s + c.projects.reduce((ps, p) => ps + (p.value ?? 0), 0), 0)

  const chartData = clients.map(c => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + '…' : c.name,
    projetos: c.projects.length,
    valor: c.projects.reduce((s, p) => s + (p.value ?? 0), 0),
  })).sort((a, b) => b.valor - a.valor)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    let logo_url: string | null = null
    if (logoFile) {
      const ext = logoFile.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage.from('client-logos').upload(path, logoFile, { upsert: true })
      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('client-logos').getPublicUrl(uploadData.path)
        logo_url = publicUrl
      }
    }

    const { data, error } = await supabase.from('clients').insert({ name: name.trim(), logo_url }).select(`
      id, name, logo_url, created_at,
      contacts:client_contacts(id, name, role, email, phone, whatsapp),
      projects(id, name, value, start_date, end_date)
    `).single()

    if (!error && data) {
      setClients(prev => [...prev, data as Client].sort((a, b) => a.name.localeCompare(b.name)))
      setName(''); setLogoFile(null); setOpen(false)
    }
    setLoading(false)
  }

  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border p-4 flex items-center gap-3">
          <div className="p-2 bg-[#00204a]/10"><Building2 className="h-5 w-5 text-[#00204a]" /></div>
          <div><div className="text-2xl font-bold text-[#00204a]">{clients.length}</div><div className="text-xs text-muted-foreground">Clientes</div></div>
        </div>
        <div className="bg-white border p-4 flex items-center gap-3">
          <div className="p-2 bg-[#fcb900]/10"><FolderOpen className="h-5 w-5 text-[#fcb900]" /></div>
          <div><div className="text-2xl font-bold text-[#00204a]">{totalProjects}</div><div className="text-xs text-muted-foreground">Projetos</div></div>
        </div>
        <div className="bg-white border p-4 flex items-center gap-3">
          <div className="p-2 bg-green-50"><TrendingUp className="h-5 w-5 text-green-600" /></div>
          <div><div className="text-2xl font-bold text-[#00204a]">{formatBRL(totalValue)}</div><div className="text-xs text-muted-foreground">Carteira Total</div></div>
        </div>
      </div>

      {/* Charts */}
      {clients.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border p-4">
            <div className="text-sm font-semibold text-[#00204a] mb-3">Projetos por Cliente</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(v) => [`${v} projetos`, 'Projetos']} />
                <Bar dataKey="projetos" radius={[2, 2, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border p-4">
            <div className="text-sm font-semibold text-[#00204a] mb-3">Carteira de Projetos por Cliente</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatBRL(v), 'Valor']} />
                <Bar dataKey="valor" radius={[2, 2, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Header + list */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}</span>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Novo Cliente</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(c => {
          const totalVal = c.projects.reduce((s, p) => s + (p.value ?? 0), 0)
          return (
            <div
              key={c.id}
              onClick={() => router.push(`/clients/${c.id}`)}
              className="bg-white border hover:border-[#00204a]/30 hover:shadow-sm transition-all cursor-pointer p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <ClientLogo name={c.name} logoUrl={c.logo_url} />
                <div>
                  <div className="font-semibold text-[#00204a]">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.contacts.length} contato{c.contacts.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t">
                <div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Briefcase className="h-3 w-3" /> Projetos</div>
                  <div className="font-bold text-lg text-[#00204a]">{c.projects.length}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Carteira</div>
                  <div className="font-bold text-sm text-green-700">{totalVal > 0 ? formatBRL(totalVal) : '—'}</div>
                </div>
              </div>
            </div>
          )
        })}
        {clients.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted-foreground">
            Nenhum cliente cadastrado ainda.
          </div>
        )}
      </div>

      {/* Create modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Nome do Cliente *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Ipiranga" required />
            </div>
            <div className="space-y-1.5">
              <Label>Logotipo <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input
                type="file"
                accept="image/*"
                onChange={e => setLogoFile(e.target.files?.[0] ?? null)}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">PNG, JPG ou SVG. Máx 2MB.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading || !name.trim()}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar Cliente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
