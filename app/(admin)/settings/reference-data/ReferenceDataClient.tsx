"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Plane, Ship, BedDouble, Loader2, Tag, BookOpen } from 'lucide-react'

interface Item { id: string; name: string; iata_code?: string }
interface TicketCategory { id: string; name: string; color: string }

interface Props {
  airlines: Item[]
  cruiseLines: Item[]
  bedTypes: Item[]
  ticketCategories: TicketCategory[]
  articleCategories: Item[]
}

function RefTable({
  title, icon: Icon, items: initial, table, iataField = false
}: {
  title: string
  icon: React.ElementType
  items: Item[]
  table: string
  iataField?: boolean
}) {
  const [items, setItems] = useState(initial)
  const [name, setName] = useState('')
  const [iata, setIata] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function add() {
    if (!name.trim()) return
    setLoading(true)
    const payload: any = { name: name.trim() }
    if (iataField && iata.trim()) payload.iata_code = iata.trim().toUpperCase()
    const { data, error } = await supabase.from(table).insert(payload).select().single()
    if (!error && data) {
      setItems([...items, data].sort((a, b) => a.name.localeCompare(b.name)))
      setName(''); setIata('')
    }
    setLoading(false)
  }

  async function remove(id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) setItems(items.filter(i => i.id !== id))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-[#00204a] flex items-center gap-2">
          <Icon className="h-4 w-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          {iataField && (
            <Input
              value={iata}
              onChange={e => setIata(e.target.value)}
              placeholder="IATA"
              className="w-20 flex-shrink-0 font-mono uppercase"
              maxLength={3}
            />
          )}
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={`Nome...`}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <Button onClick={add} disabled={loading || !name.trim()} size="sm" className="flex-shrink-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
        <div className="border divide-y max-h-64 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum item cadastrado</p>
          )}
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                {iataField && item.iata_code && (
                  <span className="font-mono text-xs bg-[#00204a]/10 text-[#00204a] px-1.5 py-0.5 font-bold">
                    {item.iata_code}
                  </span>
                )}
                <span className="text-sm">{item.name}</span>
              </div>
              <Button
                size="sm" variant="ghost"
                onClick={() => remove(item.id)}
                className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
      </CardContent>
    </Card>
  )
}

const PRESET_COLORS = [
  '#6b7280', '#ef4444', '#f59e0b', '#10b981',
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
  '#00204a', '#14532d', '#7c2d12', '#1e1b4b',
]

function TicketCategoriesTable({ categories: initial }: { categories: TicketCategory[] }) {
  const [categories, setCategories] = useState(initial)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6b7280')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function add() {
    if (!name.trim()) return
    setLoading(true)
    const { data, error } = await supabase.from('ticket_categories').insert({ name: name.trim(), color }).select().single()
    if (!error && data) {
      setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)))
      setName(''); setColor('#6b7280')
    }
    setLoading(false)
  }

  async function remove(id: string) {
    await supabase.from('ticket_categories').delete().eq('id', id)
    setCategories(categories.filter(c => c.id !== id))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-[#00204a] flex items-center gap-2">
          <Tag className="h-4 w-4" /> Categorias de Ticket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome da categoria..."
            onKeyDown={e => e.key === 'Enter' && add()}
            className="flex-1"
          />
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="h-9 w-10 cursor-pointer border border-input p-0.5 rounded flex-shrink-0"
            title="Escolher cor"
          />
          <Button onClick={add} disabled={loading || !name.trim()} size="sm" className="flex-shrink-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
              style={{ backgroundColor: c, borderColor: color === c ? '#00204a' : 'transparent' }}
            />
          ))}
        </div>

        {name && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Preview:</span>
            <span className="px-2.5 py-0.5 text-xs font-medium text-white rounded-full" style={{ backgroundColor: color }}>
              {name}
            </span>
          </div>
        )}

        <div className="border divide-y max-h-64 overflow-y-auto">
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma categoria cadastrada</p>
          )}
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
              <span className="px-2.5 py-0.5 text-xs font-medium text-white rounded-full" style={{ backgroundColor: cat.color }}>
                {cat.name}
              </span>
              <Button
                size="sm" variant="ghost"
                onClick={() => remove(cat.id)}
                className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}</p>
      </CardContent>
    </Card>
  )
}

export function ReferenceDataClient({ airlines, cruiseLines, bedTypes, ticketCategories, articleCategories }: Props) {
  return (
    <Tabs defaultValue="airlines">
      <TabsList className="mb-6">
        <TabsTrigger value="airlines" className="gap-2">
          <Plane className="h-4 w-4" /> Companhias Aéreas
        </TabsTrigger>
        <TabsTrigger value="cruises" className="gap-2">
          <Ship className="h-4 w-4" /> Companhias de Cruzeiro
        </TabsTrigger>
        <TabsTrigger value="beds" className="gap-2">
          <BedDouble className="h-4 w-4" /> Tipos de Cama
        </TabsTrigger>
        <TabsTrigger value="ticket-categories" className="gap-2">
          <Tag className="h-4 w-4" /> Categorias de Ticket
        </TabsTrigger>
        <TabsTrigger value="article-categories" className="gap-2">
          <BookOpen className="h-4 w-4" /> Categorias de Artigo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="airlines">
        <div className="max-w-lg">
          <RefTable title="Companhia Aérea" icon={Plane} items={airlines} table="airlines" iataField />
        </div>
      </TabsContent>

      <TabsContent value="cruises">
        <div className="max-w-lg">
          <RefTable title="Companhia de Cruzeiro" icon={Ship} items={cruiseLines} table="cruise_lines" />
        </div>
      </TabsContent>

      <TabsContent value="beds">
        <div className="max-w-lg">
          <RefTable title="Tipo de Cama" icon={BedDouble} items={bedTypes} table="bed_types" />
        </div>
      </TabsContent>

      <TabsContent value="ticket-categories">
        <div className="max-w-lg">
          <TicketCategoriesTable categories={ticketCategories} />
        </div>
      </TabsContent>

      <TabsContent value="article-categories">
        <div className="max-w-lg">
          <RefTable title="Categoria de Artigo" icon={BookOpen} items={articleCategories} table="article_categories" />
        </div>
      </TabsContent>
    </Tabs>
  )
}
