import { Ticket, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  open: number
  inProgress: number
  resolvedToday: number
}

export function GuideTicketsSummary({ open, inProgress, resolvedToday }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-red-50">
            <Ticket className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#00204a]">{open}</div>
            <div className="text-xs text-muted-foreground">Abertos</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-yellow-50">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#00204a]">{inProgress}</div>
            <div className="text-xs text-muted-foreground">Em Andamento</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-green-50">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#00204a]">{resolvedToday}</div>
            <div className="text-xs text-muted-foreground">Resolvidos Hoje</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
