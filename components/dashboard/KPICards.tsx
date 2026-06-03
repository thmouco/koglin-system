import { Ticket, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  openTickets: number
  resolvedToday: number
  avgResolutionHours: number
  sameDayRate: number
  unattended2h: number
}

export function KPICards({ openTickets, resolvedToday, avgResolutionHours, sameDayRate, unattended2h }: Props) {
  const kpis = [
    {
      label: 'Tickets Abertos',
      value: openTickets,
      icon: Ticket,
      color: 'text-red-600',
      bg: 'bg-red-50',
      format: (v: number) => v.toString(),
    },
    {
      label: 'Resolvidos Hoje',
      value: resolvedToday,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      format: (v: number) => v.toString(),
    },
    {
      label: 'Tempo Médio (horas)',
      value: avgResolutionHours,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      format: (v: number) => v.toFixed(1) + 'h',
    },
    {
      label: 'Taxa Resolução Mesmo Dia',
      value: sameDayRate,
      icon: TrendingUp,
      color: 'text-[#00204a]',
      bg: 'bg-[#00204a]/5',
      format: (v: number) => v.toFixed(0) + '%',
    },
    {
      label: 'Sem Resposta +2h',
      value: unattended2h,
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      format: (v: number) => v.toString(),
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground leading-tight mb-2">{kpi.label}</p>
                  <p className="text-2xl font-bold text-[#00204a]">{kpi.format(kpi.value)}</p>
                </div>
                <div className={`p-2 ${kpi.bg}`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
