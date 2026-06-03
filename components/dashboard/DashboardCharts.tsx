"use client"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { categoryLabel } from '@/lib/utils'

const COLORS = ['#00204a', '#fcb900', '#3b82f6', '#10b981', '#f97316', '#8b5cf6']

interface Props {
  timelineData: { date: string; open: number; resolved: number }[]
  categoryData: { name: string; value: number }[]
  byGroupData: { name: string; count: number }[]
  ranking: { guide_name: string; avg_resolution_hours: number }[]
}

export function DashboardCharts({ timelineData, categoryData, byGroupData, ranking }: Props) {
  const formatDate = (d: string) => {
    const [, m, day] = d.split('-')
    return `${day}/${m}`
  }

  const avgByGuide = ranking.slice(0, 8).map(r => ({
    name: r.guide_name.split(' ')[0],
    horas: parseFloat(r.avg_resolution_hours.toFixed(1)),
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Timeline */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#00204a]">Tickets Abertos vs. Resolvidos (últimos 30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gOpen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00204a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00204a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fcb900" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fcb900" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v, n) => [v, n === 'open' ? 'Abertos' : 'Resolvidos']}
                labelFormatter={formatDate}
              />
              <Legend formatter={v => v === 'open' ? 'Abertos' : 'Resolvidos'} />
              <Area type="monotone" dataKey="open" stroke="#00204a" strokeWidth={2} fill="url(#gOpen)" />
              <Area type="monotone" dataKey="resolved" stroke="#fcb900" strokeWidth={2} fill="url(#gResolved)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Pie */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#00204a]">Tickets por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData.map(d => ({ ...d, name: categoryLabel(d.name) }))}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* By Group */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#00204a]">Tickets por Grupo (top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byGroupData} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#00204a" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Avg resolution by guide */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#00204a]">Tempo Médio de Resolução por Guia (horas)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={avgByGuide} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={v => [`${v}h`, 'Tempo médio']} />
              <Bar dataKey="horas" fill="#fcb900" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
