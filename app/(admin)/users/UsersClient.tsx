"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Loader2, UserPlus, Pencil, Search, Mail, Shield, User } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import type { User } from '@/types'

interface Props { users: User[] }

const roleLabels: Record<string, string> = {
  admin: 'Administrador', collaborator: 'Colaborador', guide: 'Guia'
}
const roleColors: Record<string, string> = {
  admin: 'bg-[#00204a] text-white',
  collaborator: 'bg-blue-100 text-blue-700',
  guide: 'bg-[#fcb900]/20 text-[#a07800]',
}

export function UsersClient({ users: initial }: Props) {
  const [users, setUsers] = useState(initial)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<string>('')
  const [inviteName, setInviteName] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [inviteWhatsapp, setInviteWhatsapp] = useState('')
  const [editRole, setEditRole] = useState<string>('guide')
  const [editActive, setEditActive] = useState(true)
  const [editPhone, setEditPhone] = useState('')
  const [editWhatsapp, setEditWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteRole) return
    setLoading(true)
    setSuccess('')

    const res = await fetch('/api/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole, full_name: inviteName, phone: invitePhone, whatsapp: inviteWhatsapp }),
    })

    if (res.ok) {
      setSuccess(`Convite enviado para ${inviteEmail}`)
      setInviteOpen(false)
      setInviteEmail(''); setInviteName(''); setInviteRole('')
      setInvitePhone(''); setInviteWhatsapp('')
    }
    setLoading(false)
  }

  function openEdit(u: User) {
    setEditing(u)
    setEditRole(u.role)
    setEditActive((u as any).is_active !== false)
    setEditPhone((u as any).phone ?? '')
    setEditWhatsapp(u.whatsapp ?? '')
    setEditOpen(true)
  }

  async function handleEditSave() {
    if (!editing) return
    setLoading(true)
    const { error } = await supabase
      .from('users')
      .update({ role: editRole, is_active: editActive, phone: editPhone || null, whatsapp: editWhatsapp || null })
      .eq('id', editing.id)

    if (!error) {
      setUsers(users.map(u => u.id === editing.id ? { ...u, role: editRole as any, is_active: editActive, phone: editPhone || null, whatsapp: editWhatsapp || null } : u))
      setEditOpen(false)
    }
    setLoading(false)
  }

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar usuários..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4" /> Convidar Usuário
        </Button>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Usuário', 'E-mail', 'Perfil', 'WhatsApp', 'Status', 'Cadastro', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-[#00204a] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {u.full_name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="font-medium">{u.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 text-xs font-medium', roleColors[u.role])}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3"><WhatsAppButton number={u.whatsapp} /></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium ${(u as any).is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {(u as any).is_active !== false ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Nome completo *</Label>
              <Input value={inviteName} onChange={e => setInviteName(e.target.value)} required placeholder="Nome do usuário" />
            </div>
            <div className="space-y-1.5">
              <Label>E-mail *</Label>
              <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Perfil *</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className={!inviteRole ? 'text-muted-foreground' : ''}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="collaborator">Colaborador</SelectItem>
                  <SelectItem value="guide">Guia</SelectItem>
                </SelectContent>
              </Select>
              {!inviteRole && <p className="text-xs text-destructive mt-1">Obrigatório</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Telefone</Label>
                <Input value={invitePhone} onChange={e => setInvitePhone(e.target.value)} placeholder="+5551999..." />
              </div>
              <div className="space-y-1.5">
                <Label>WhatsApp</Label>
                <Input value={inviteWhatsapp} onChange={e => setInviteWhatsapp(e.target.value)} placeholder="+5551999..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading || !inviteRole}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Mail className="h-4 w-4" /> Enviar Convite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário: {editing?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Perfil</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className={!editRole ? 'text-muted-foreground' : ''}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="collaborator">Colaborador</SelectItem>
                  <SelectItem value="guide">Guia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={editActive ? 'active' : 'inactive'} onValueChange={v => setEditActive(v === 'active')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Telefone</Label>
                <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+5551999..." />
              </div>
              <div className="space-y-1.5">
                <Label>WhatsApp</Label>
                <Input value={editWhatsapp} onChange={e => setEditWhatsapp(e.target.value)} placeholder="+5551999..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditSave} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
