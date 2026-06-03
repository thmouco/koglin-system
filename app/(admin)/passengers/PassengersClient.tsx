"use client"
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Upload, Search, Loader2, Eye, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { AirportInput } from '@/components/ui/AirportInput'

interface Passenger {
  id: string; first_name: string; last_name: string
  birth_date?: string
  email?: string; phone?: string; whatsapp?: string
  passport_number?: string; company_name?: string
  hotel_name?: string; room_category?: string; bed_type?: string
  checkin_date?: string; checkout_date?: string
  departure_airline?: string; departure_airport?: string
  departure_date?: string; departure_time?: string
  return_airline?: string; return_airport?: string
  return_date?: string; return_time?: string
  ship_number?: string; deck?: string
  cabin_category?: string; cabin_type?: string
  group_id: string; group?: { id: string; name: string }
}
interface Group { id: string; name: string }
interface RefItem { id: string; name: string; iata_code?: string }

interface Props {
  passengers: Passenger[]
  groups: Group[]
  airlines: RefItem[]
  cruiseLines: RefItem[]
  bedTypes: RefItem[]
}

const CSV_COLUMNS = [
  { key: 'first_name', label: 'Nome' },
  { key: 'last_name', label: 'Sobrenome' },
  { key: 'birth_date', label: 'Dt. Nascimento' },
  { key: 'email', label: 'E-mail' },
  { key: 'phone', label: 'Telefone' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'passport_number', label: 'Passaporte' },
  { key: 'company_name', label: 'Empresa' },
  { key: 'hotel_name', label: 'Hotel' },
  { key: 'room_category', label: 'Categoria Quarto' },
  { key: 'bed_type', label: 'Tipo Cama' },
  { key: 'checkin_date', label: 'Check-in' },
  { key: 'checkout_date', label: 'Check-out' },
  { key: 'departure_airline', label: 'Cia. Ida' },
  { key: 'departure_airport', label: 'Aeroporto Ida' },
  { key: 'departure_date', label: 'Data Voo Ida' },
  { key: 'departure_time', label: 'Hora Voo Ida' },
  { key: 'return_airline', label: 'Cia. Volta' },
  { key: 'return_airport', label: 'Aeroporto Volta' },
  { key: 'return_date', label: 'Data Voo Volta' },
  { key: 'return_time', label: 'Hora Voo Volta' },
  { key: 'ship_number', label: 'Navio' },
  { key: 'deck', label: 'Deck' },
  { key: 'cabin_category', label: 'Cat. Cabine' },
  { key: 'cabin_type', label: 'Tipo Cabine' },
]

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="font-medium text-sm">{value || '—'}</div>
    </div>
  )
}

export function PassengersClient({ passengers: initial, groups, airlines, cruiseLines, bedTypes }: Props) {
  const [passengers, setPassengers] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('all')
  const [viewOpen, setViewOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [selected, setSelected] = useState<Passenger | null>(null)
  const [loading, setLoading] = useState(false)
  const [importGroupId, setImportGroupId] = useState('')
  const [csvPreview, setCsvPreview] = useState<any[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState<Partial<Passenger>>({})
  const f = (k: keyof Passenger) => (v: string) => setForm(prev => ({ ...prev, [k]: v }))

  function handleView(p: Passenger) { setSelected(p); setViewOpen(true) }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, { header: true, skipEmptyLines: true, complete: r => setCsvPreview(r.data as any[]) })
  }

  function downloadTemplate() {
    const header = CSV_COLUMNS.map(c => c.label).join(',')
    const example = CSV_COLUMNS.map(c => {
      const ex: Record<string, string> = {
        'Nome': 'João', 'Sobrenome': 'Silva', 'Dt. Nascimento': '1985-03-20',
        'E-mail': 'joao.silva@email.com', 'Telefone': '5551999001001', 'WhatsApp': '5551999001001',
        'Passaporte': 'BR1234567', 'Empresa': 'Silva Ltda',
        'Hotel': 'Hotel Ibis Lisboa', 'Categoria Quarto': 'Standard', 'Tipo Cama': 'Casal',
        'Check-in': '2026-06-10', 'Check-out': '2026-06-20',
        'Cia. Ida': 'LATAM', 'Aeroporto Ida': 'GRU – São Paulo', 'Data Voo Ida': '2026-06-10', 'Hora Voo Ida': '09:00',
        'Cia. Volta': 'LATAM', 'Aeroporto Volta': 'GRU – São Paulo', 'Data Voo Volta': '2026-06-20', 'Hora Voo Volta': '18:00',
        'Navio': '', 'Deck': '', 'Cat. Cabine': '', 'Tipo Cabine': '',
      }
      return `"${ex[c.label] ?? ''}"`
    }).join(',')
    const csv = `${header}\n${example}`
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'modelo_passageiros_koglin.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport() {
    if (!importGroupId || csvPreview.length === 0) return
    setLoading(true)
    const records = csvPreview.map(row => {
      const obj: any = { group_id: importGroupId }
      CSV_COLUMNS.forEach(col => {
        const val = row[col.label] ?? row[col.key]
        if (val !== undefined && val !== '') obj[col.key] = val
      })
      return obj
    }).filter(r => r.first_name || r.last_name)
    const { error } = await supabase.from('passengers').insert(records)
    setLoading(false)
    if (!error) { setImportOpen(false); setCsvPreview([]); router.refresh() }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.group_id) return
    setLoading(true)
    const { error } = await supabase.from('passengers').insert(form)
    setLoading(false)
    if (!error) { setCreateOpen(false); setForm({}); router.refresh() }
  }

  const filtered = passengers.filter(p => {
    const name = `${p.first_name} ${p.last_name}`.toLowerCase()
    const q = search.toLowerCase()
    const match = !search || name.includes(q) || p.email?.toLowerCase().includes(q) ||
      p.whatsapp?.includes(search) || p.passport_number?.toLowerCase().includes(q)
    return match && (filterGroup === 'all' || p.group_id === filterGroup)
  })

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Nome, e-mail, WhatsApp ou passaporte..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Todos os grupos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os grupos</SelectItem>
            {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} passageiros</span>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4" /> Importar CSV
          </Button>
          <Button onClick={() => { setForm({}); setCreateOpen(true) }}>
            <Plus className="h-4 w-4" /> Novo Passageiro
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['Passageiro', 'Grupo', 'WhatsApp', 'Hotel', 'Check-in', 'Voo Ida', 'Ações'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Nenhum passageiro encontrado.</td></tr>
                )}
                {filtered.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleView(p)}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.first_name} {p.last_name}</div>
                      <div className="text-xs text-muted-foreground">{p.email ?? '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.group?.name ?? '—'}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}><WhatsAppButton number={p.whatsapp} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{p.hotel_name ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.checkin_date)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.departure_date)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); handleView(p) }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── VIEW MODAL ── */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.first_name} {selected?.last_name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <Tabs defaultValue="personal">
              <TabsList className="mb-4 flex-wrap h-auto">
                <TabsTrigger value="personal">Pessoal</TabsTrigger>
                <TabsTrigger value="contact">Contato</TabsTrigger>
                <TabsTrigger value="flight">Voos</TabsTrigger>
                <TabsTrigger value="hotel">Hotel</TabsTrigger>
                <TabsTrigger value="ship">Navio</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nome" value={selected.first_name} />
                  <Field label="Sobrenome" value={selected.last_name} />
                  <Field label="Data de Nascimento" value={formatDate(selected.birth_date)} />
                  <Field label="Passaporte" value={selected.passport_number} />
                  <Field label="Empresa" value={selected.company_name} />
                  <Field label="Grupo" value={selected.group?.name} />
                </div>
              </TabsContent>

              <TabsContent value="contact">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="E-mail" value={selected.email} />
                  <Field label="Telefone" value={selected.phone} />
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">WhatsApp</div>
                    <WhatsAppButton number={selected.whatsapp} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="flight">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Voo de Ida</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Cia. Aérea" value={selected.departure_airline} />
                      <Field label="Aeroporto" value={selected.departure_airport} />
                      <Field label="Data" value={formatDate(selected.departure_date)} />
                      <Field label="Horário" value={selected.departure_time} />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Voo de Volta</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Cia. Aérea" value={selected.return_airline} />
                      <Field label="Aeroporto" value={selected.return_airport} />
                      <Field label="Data" value={formatDate(selected.return_date)} />
                      <Field label="Horário" value={selected.return_time} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hotel">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Hotel" value={selected.hotel_name} />
                  <Field label="Categoria do Quarto" value={selected.room_category} />
                  <Field label="Tipo de Cama" value={selected.bed_type} />
                  <Field label="Check-in" value={formatDate(selected.checkin_date)} />
                  <Field label="Check-out" value={formatDate(selected.checkout_date)} />
                </div>
              </TabsContent>

              <TabsContent value="ship">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Navio / Cruzeiro" value={selected.ship_number} />
                  <Field label="Deck" value={selected.deck} />
                  <Field label="Categoria da Cabine" value={selected.cabin_category} />
                  <Field label="Tipo da Cabine" value={selected.cabin_type} />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* ── CREATE MODAL ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Passageiro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <Tabs defaultValue="personal" className="mt-2">
              <TabsList className="flex-wrap h-auto mb-4">
                <TabsTrigger value="personal">Pessoal</TabsTrigger>
                <TabsTrigger value="contact">Contato</TabsTrigger>
                <TabsTrigger value="flight">Voos</TabsTrigger>
                <TabsTrigger value="hotel">Hotel</TabsTrigger>
                <TabsTrigger value="ship">Navio</TabsTrigger>
              </TabsList>

              {/* PESSOAL */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Nome *</Label>
                    <Input required value={form.first_name ?? ''} onChange={e => setForm(p => ({...p, first_name: e.target.value}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Sobrenome *</Label>
                    <Input required value={form.last_name ?? ''} onChange={e => setForm(p => ({...p, last_name: e.target.value}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Data de Nascimento</Label>
                    <Input type="date" value={form.birth_date ?? ''} onChange={e => setForm(p => ({...p, birth_date: e.target.value}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Passaporte</Label>
                    <Input value={form.passport_number ?? ''} onChange={e => setForm(p => ({...p, passport_number: e.target.value}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Empresa</Label>
                    <Input value={form.company_name ?? ''} onChange={e => setForm(p => ({...p, company_name: e.target.value}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Grupo *</Label>
                    <Select value={form.group_id ?? ''} onValueChange={v => setForm(p => ({...p, group_id: v}))}>
                      <SelectTrigger className={!form.group_id ? 'text-muted-foreground' : ''}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* CONTATO */}
              <TabsContent value="contact" className="space-y-4">
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email ?? ''} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Telefone</Label>
                  <PhoneInput value={form.phone} onChange={v => setForm(p => ({...p, phone: v}))} />
                </div>
                <div className="space-y-1.5">
                  <Label>WhatsApp</Label>
                  <PhoneInput value={form.whatsapp} onChange={v => setForm(p => ({...p, whatsapp: v}))} />
                </div>
              </TabsContent>

              {/* VOOS */}
              <TabsContent value="flight" className="space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Voo de Ida</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Cia. Aérea</Label>
                    <Select value={form.departure_airline ?? ''} onValueChange={v => setForm(p => ({...p, departure_airline: v}))}>
                      <SelectTrigger className={!form.departure_airline ? 'text-muted-foreground' : ''}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {airlines.map(a => <SelectItem key={a.id} value={a.name}>{a.iata_code ? `[${a.iata_code}] ` : ''}{a.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Aeroporto de Partida</Label>
                    <AirportInput value={form.departure_airport} onChange={v => setForm(p => ({...p, departure_airport: v}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Data do Voo</Label>
                    <Input type="date" value={form.departure_date ?? ''} onChange={e => setForm(p => ({...p, departure_date: e.target.value}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Horário</Label>
                    <Input type="time" value={form.departure_time ?? ''} onChange={e => setForm(p => ({...p, departure_time: e.target.value}))} />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Voo de Volta</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Cia. Aérea</Label>
                      <Select value={form.return_airline ?? ''} onValueChange={v => setForm(p => ({...p, return_airline: v}))}>
                        <SelectTrigger className={!form.return_airline ? 'text-muted-foreground' : ''}>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {airlines.map(a => <SelectItem key={a.id} value={a.name}>{a.iata_code ? `[${a.iata_code}] ` : ''}{a.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Aeroporto de Destino/Retorno</Label>
                      <AirportInput value={form.return_airport} onChange={v => setForm(p => ({...p, return_airport: v}))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Data do Voo</Label>
                      <Input type="date" value={form.return_date ?? ''} onChange={e => setForm(p => ({...p, return_date: e.target.value}))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Horário</Label>
                      <Input type="time" value={form.return_time ?? ''} onChange={e => setForm(p => ({...p, return_time: e.target.value}))} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* HOTEL */}
              <TabsContent value="hotel" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label>Nome do Hotel</Label>
                    <Input value={form.hotel_name ?? ''} onChange={e => setForm(p => ({...p, hotel_name: e.target.value}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Categoria do Quarto</Label>
                    <Input value={form.room_category ?? ''} onChange={e => setForm(p => ({...p, room_category: e.target.value}))} placeholder="Standard, Superior, Suite..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tipo de Cama</Label>
                    <Select value={form.bed_type ?? ''} onValueChange={v => setForm(p => ({...p, bed_type: v}))}>
                      <SelectTrigger className={!form.bed_type ? 'text-muted-foreground' : ''}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bedTypes.length > 0
                          ? bedTypes.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)
                          : ['Casal','Solteiro','Twin','King','Queen','Beliche'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Check-in</Label>
                    <Input type="date" value={form.checkin_date ?? ''} onChange={e => setForm(p => ({...p, checkin_date: e.target.value}))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Check-out</Label>
                    <Input type="date" value={form.checkout_date ?? ''} onChange={e => setForm(p => ({...p, checkout_date: e.target.value}))} />
                  </div>
                </div>
              </TabsContent>

              {/* NAVIO */}
              <TabsContent value="ship" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label>Companhia / Nome do Navio</Label>
                    <Select value={form.ship_number ?? ''} onValueChange={v => setForm(p => ({...p, ship_number: v}))}>
                      <SelectTrigger className={!form.ship_number ? 'text-muted-foreground' : ''}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cruiseLines.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Deck</Label>
                    <Input value={form.deck ?? ''} onChange={e => setForm(p => ({...p, deck: e.target.value}))} placeholder="Ex: 7, 8, Deck Lido..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Categoria da Cabine</Label>
                    <Input value={form.cabin_category ?? ''} onChange={e => setForm(p => ({...p, cabin_category: e.target.value}))} placeholder="Interior, Balcony, Suite..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tipo da Cabine</Label>
                    <Select value={form.cabin_type ?? ''} onValueChange={v => setForm(p => ({...p, cabin_type: v}))}>
                      <SelectTrigger className={!form.cabin_type ? 'text-muted-foreground' : ''}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {['Casal','Solteiro','Twin','Familiar'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading || !form.group_id}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Cadastrar Passageiro
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── IMPORT MODAL ── */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Passageiros via CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 text-sm text-blue-700">
              <Download className="h-4 w-4 flex-shrink-0" />
              <span>Baixe o modelo com as colunas corretas antes de importar.</span>
              <Button size="sm" variant="outline" onClick={downloadTemplate} className="ml-auto flex-shrink-0 text-blue-700 border-blue-300 hover:bg-blue-100">
                Baixar Modelo
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label>Grupo de destino *</Label>
              <Select value={importGroupId} onValueChange={setImportGroupId}>
                <SelectTrigger className={!importGroupId ? 'text-muted-foreground' : ''}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Arquivo CSV</Label>
              <div
                className="border-2 border-dashed border-gray-200 p-6 text-center cursor-pointer hover:border-[#00204a]/40 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Clique para selecionar o arquivo CSV</p>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
              </div>
            </div>

            {csvPreview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">{csvPreview.length} registros encontrados</p>
                <div className="border overflow-x-auto max-h-48">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        {['Nome','Sobrenome','E-mail','WhatsApp'].map(h => (
                          <th key={h} className="px-2 py-1.5 text-left font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-2 py-1.5">{row['Nome'] ?? row['first_name']}</td>
                          <td className="px-2 py-1.5">{row['Sobrenome'] ?? row['last_name']}</td>
                          <td className="px-2 py-1.5">{row['E-mail'] ?? row['email']}</td>
                          <td className="px-2 py-1.5">{row['WhatsApp'] ?? row['whatsapp']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvPreview.length > 5 && <p className="text-xs text-muted-foreground">... e mais {csvPreview.length - 5}</p>}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setImportOpen(false); setCsvPreview([]) }}>Cancelar</Button>
            <Button onClick={handleImport} disabled={loading || !importGroupId || csvPreview.length === 0}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Importar {csvPreview.length > 0 ? `(${csvPreview.length})` : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
