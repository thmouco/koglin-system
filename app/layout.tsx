import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Koglin Viagens — Sistema de Grupos',
  description: 'Gerenciamento de grupos de viagem | Koglin Viagens · Lufthansa City Center',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
