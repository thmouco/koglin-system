import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'
import type { GuideStats } from '@/types'

interface Props {
  ranking: GuideStats[]
}

export function GuideRanking({ ranking }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-[#00204a]">Ranking de Guias</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Guia</th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Grupo</th>
                <th className="text-right px-5 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Abertos</th>
                <th className="text-right px-5 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Resolvidos</th>
                <th className="text-right px-5 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Média (h)</th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Último Ticket</th>
              </tr>
            </thead>
            <tbody>
              {ranking.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum dado disponível
                  </td>
                </tr>
              )}
              {ranking.map((r, i) => (
                <tr key={r.guide_id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-5 py-3 font-medium">{r.guide_name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.group_name}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-semibold ${r.open_tickets > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {r.open_tickets}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-green-600">{r.resolved_tickets}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">
                    {r.avg_resolution_hours > 0 ? r.avg_resolution_hours.toFixed(1) + 'h' : '—'}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{formatDateTime(r.last_ticket_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
