import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pt-BR', opts ?? { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    hotel: 'Hotel',
    ship: 'Navio',
    flight: 'Voo',
    transfer: 'Translado',
    other: 'Outro',
  }
  return map[cat] ?? cat
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    open: 'Aberto',
    in_progress: 'Em andamento',
    resolved: 'Resolvido',
    closed: 'Fechado',
  }
  return map[status] ?? status
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    open: 'bg-red-100 text-red-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    hotel: 'bg-blue-100 text-blue-700',
    ship: 'bg-cyan-100 text-cyan-700',
    flight: 'bg-purple-100 text-purple-700',
    transfer: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-600',
  }
  return map[cat] ?? 'bg-gray-100 text-gray-600'
}
