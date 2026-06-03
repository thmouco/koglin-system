"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Search, MessageSquare, Loader2, Clock, CheckCircle } from 'lucide-react'
import { formatDateTime, statusLabel, statusColor, cn } from '@/lib/utils'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

interface Ticket {
  id: string; category: string; status: string; description: string
  created_at: string; updated_at: string; resolved_at?: string
  passenger_whatsapp?: string
  passenger?: { first_name: string; last_name: string; whatsapp?: string }
  guide?: { id: string; full_name: string }
  group?: { id: string; name: string }
}

interface Message {
  id: string; sender: string; content: string; created_at: string
}

interface TicketCategory { id: string; name: string; color: string }

interface Props {
  tickets: Ticket[]
  categories: TicketCategory[]
  isGuide: boolean
  guideId?: string
}

export function TicketsClient({ tickets: initial, categories, isGuide, guideId }: Props) {
  function getCategoryColor(name: string) {
    return categories.find(c => c.name === name)?.color ?? '#6b7280'
  }
  const [tickets, setTickets] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [resolveNote, setResolveNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function openTicket(t: Ticket) {
    setSelected(t)
    setResolveNote('')
    const { data } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', t.id)
      .order('created_at')
    setMessages(data ?? [])
    setDetailOpen(true)
  }

  async function updateStatus(ticketId: string, status: string, note?: string) {
    setLoading(true)
    const update: any = { status }
    if (status === 'resolved') {
      update.resolved_at = new Date().toISOString()
      update.resolution_notes = note
    }
    if (status === 'in_progress') {
      update.resolved_at = null
    }

    const { error } = await supabase.from('tickets').update(update).eq('id', ticketId)
    if (!error) {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, ...update } : t))
      if (selected?.id === ticketId) setSelected(prev => prev ? { ...prev, ...update } : null)
    }
    setLoading(false)
    if (status === 'resolved') setDetailOpen(false)
  }

  const filtered = tickets.filter(t => {
    const name = `${t.passenger?.first_name ?? ''} ${t.passenger?.last_name ?? ''}`.toLowerCase()
    const match = name.includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'all' || t.status === filterStatus
    const catMatch = filterCategory === 'all' || t.category === filterCategory
    return match && statusMatch && catMatch
  })

  const senderLabel = (s: string) => ({
    passenger: 'Passageiro', agent_ai: 'Kogi (IA)',
    guide: 'Guia', system: 'Sistema'
  }[s] ?? s)

  const senderColor = (s: string) => ({
    passenger: 'bg-gray-100 text-gray-700',
    agent_ai: 'bg-[#00204a]/10 text-[#00204a]',
    guide: 'bg-[#fcb900]/20 text-[#a07800]',
    system: 'bg-blue-50 text-blue-600',
  }[s] ?? 'bg-gray-100')

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar tickets..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="open">Aberto</SelectItem>
            <SelectItem value="in_progress">Em andamento</SelectItem>
            <SelectItem value="resolved">Resolvido</SelectItem>
            <SelectItem value="closed">Fechado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.name}>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} tickets</span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['#', 'Status', 'Categoria', 'Passageiro', 'Grupo', 'Guia', 'Descrição', 'Data', 'Ações'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">Nenhum ticket encontrado.</td></tr>
                )}
                {filtered.map(t => (
                  <tr key={t.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{t.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 text-xs font-medium', statusColor(t.status))}>
                        {statusLabel(t.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-xs font-medium text-white rounded-full" style={{ backgroundColor: getCategoryColor(t.category) }}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {t.passenger ? `${t.passenger.first_name} ${t.passenger.last_name}` : t.passenger_whatsapp ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{t.group?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.guide?.full_name ?? '—'}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate text-muted-foreground">{t.description}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(t.created_at)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={() => openTicket(t)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Detail */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>Ticket #{selected?.id.slice(0, 8)}</span>
              {selected && (
                <>
                  <span className={cn('px-2 py-0.5 text-xs font-medium', statusColor(selected.status))}>
                    {statusLabel(selected.status)}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium text-white rounded-full" style={{ backgroundColor: getCategoryColor(selected.category) }}>
                    {selected.category}
                  </span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="flex flex-col gap-4 overflow-hidden flex-1">
              {/* Info */}
              <div className="grid grid-cols-3 gap-3 text-sm bg-gray-50 p-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Passageiro</div>
                  <div className="font-medium">
                    {selected.passenger
                      ? `${selected.passenger.first_name} ${selected.passenger.last_name}`
                      : selected.passenger_whatsapp ?? '—'}
                  </div>
                  <WhatsAppButton
                    number={selected.passenger?.whatsapp ?? selected.passenger_whatsapp}
                    showNumber={false}
                    className="mt-1"
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Guia</div>
                  <div className="font-medium">{selected.guide?.full_name ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Grupo</div>
                  <div className="font-medium">{selected.group?.name ?? '—'}</div>
                </div>
              </div>

              {/* Description */}
              <div className="text-sm">
                <div className="text-xs text-muted-foreground mb-1">Descrição</div>
                <p className="text-foreground">{selected.description}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Histórico de Mensagens ({messages.length})
                </div>
                {messages.map(m => (
                  <div key={m.id} className={cn(
                    'p-3 text-sm',
                    m.sender === 'passenger' ? 'bg-gray-50 border-l-2 border-gray-300' :
                    m.sender === 'agent_ai' ? 'bg-[#00204a]/5 border-l-2 border-[#00204a]' :
                    m.sender === 'guide' ? 'bg-[#fcb900]/10 border-l-2 border-[#fcb900]' :
                    'bg-blue-50 border-l-2 border-blue-300'
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{senderLabel(m.sender)}</span>
                      <span className="text-xs text-muted-foreground">{formatDateTime(m.created_at)}</span>
                    </div>
                    <p className="text-foreground">{m.content}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">Nenhuma mensagem registrada.</p>
                )}
              </div>

              {/* Actions */}
              {(isGuide || !isGuide) && selected.status !== 'resolved' && selected.status !== 'closed' && (
                <div className="border-t border-border pt-3 space-y-3">
                  {selected.status === 'open' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(selected.id, 'in_progress')}
                      disabled={loading}
                    >
                      <Clock className="h-4 w-4" /> Marcar Em Andamento
                    </Button>
                  )}
                  {(selected.status === 'open' || selected.status === 'in_progress') && (
                    <div className="space-y-2">
                      <Label className="text-xs">Nota de resolução *</Label>
                      <Textarea
                        placeholder="Descreva como o problema foi resolvido..."
                        value={resolveNote}
                        onChange={e => setResolveNote(e.target.value)}
                        className="text-sm"
                        rows={2}
                      />
                      <Button
                        size="sm"
                        onClick={() => updateStatus(selected.id, 'resolved', resolveNote)}
                        disabled={loading || !resolveNote.trim()}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Marcar como Resolvido
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
