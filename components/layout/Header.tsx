"use client"
import { Bell } from 'lucide-react'
import type { User } from '@/types'

interface HeaderProps {
  title: string
  subtitle?: string
  user: User
  actions?: React.ReactNode
}

export function Header({ title, subtitle, user, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-border">
      <div>
        <h1 className="text-xl font-bold text-[#00204a]">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
      </div>
    </header>
  )
}
