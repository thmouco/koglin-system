"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Map, UserCheck, Ticket,
  BookOpen, Settings, LogOut, Plane, Database, Building2
} from 'lucide-react'
import type { User } from '@/types'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles: string[]
  badge?: number
}

interface NavSection {
  label: string
  roles: string[]
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Principal',
    roles: ['admin', 'collaborator', 'guide'],
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'collaborator', 'guide'] },
      { href: '/clients', label: 'Clientes', icon: Building2, roles: ['admin', 'collaborator'] },
      { href: '/groups', label: 'Grupos', icon: Map, roles: ['admin', 'collaborator'] },
      { href: '/passengers', label: 'Passageiros', icon: Users, roles: ['admin', 'collaborator', 'guide'] },
      { href: '/tickets', label: 'Tickets', icon: Ticket, roles: ['admin', 'collaborator', 'guide'] },
      { href: '/settings/knowledge-base', label: 'Base de Conhecimento', icon: BookOpen, roles: ['admin', 'collaborator', 'guide'] },
    ],
  },
  {
    label: 'Configurações',
    roles: ['admin'],
    items: [
      { href: '/users', label: 'Usuários', icon: UserCheck, roles: ['admin'] },
      { href: '/settings/reference-data', label: 'Tabelas de Referência', icon: Database, roles: ['admin'] },
      { href: '/settings/integrations', label: 'Integrações', icon: Settings, roles: ['admin'] },
    ],
  },
]

interface SidebarProps {
  user: User
  openTickets?: number
  onSignOut: () => void
}

export function Sidebar({ user, openTickets = 0, onSignOut }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#00204a] text-white flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-[#fcb900]" />
          <div>
            <div className="font-bold text-sm leading-tight">Koglin Viagens</div>
            <div className="text-xs text-white/50 leading-tight">Sistema de Grupos</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navSections.map(section => {
          const visibleItems = section.items.filter(item => item.roles.includes(user.role))
          if (visibleItems.length === 0) return null

          return (
            <div key={section.label} className="px-3 mb-4">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {section.label}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  const showBadge = item.href === '/tickets' && openTickets > 0

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors group relative",
                        isActive
                          ? "bg-[#fcb900]/15 text-[#fcb900] border-l-[3px] border-[#fcb900] pl-[9px]"
                          : "text-white/70 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {showBadge && (
                        <span className="flex h-5 w-5 items-center justify-center bg-[#fcb900] text-[#00204a] text-xs font-bold badge-pulse">
                          {openTickets > 99 ? '99+' : openTickets}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center bg-[#fcb900] text-[#00204a] text-xs font-bold flex-shrink-0">
            {user.full_name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-sm font-medium truncate">{user.full_name}</div>
            <div className="text-xs text-white/50 capitalize">{
              user.role === 'admin' ? 'Administrador' :
              user.role === 'collaborator' ? 'Colaborador' : 'Guia'
            }</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
