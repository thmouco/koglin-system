import { Header } from '@/components/layout/Header'

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Integrações" subtitle="Configurações de APIs e serviços externos" user={null as any} />
      <main className="flex-1 p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Twilio */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-semibold text-[#00204a] mb-1">Twilio — WhatsApp Business</h2>
            <p className="text-sm text-muted-foreground mb-4">Configure as variáveis de ambiente no Vercel ou no arquivo .env.local</p>
            <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 border border-border">
              <div><span className="text-[#00204a]">TWILIO_ACCOUNT_SID</span>=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
              <div><span className="text-[#00204a]">TWILIO_AUTH_TOKEN</span>=your-auth-token</div>
              <div><span className="text-[#00204a]">TWILIO_WHATSAPP_NUMBER</span>=whatsapp:+14155238886</div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Webhook URL para configurar no Twilio Console:
              <code className="ml-1 px-1 py-0.5 bg-gray-100 font-mono">{'{APP_URL}'}/api/webhooks/whatsapp</code>
            </p>
          </div>

          {/* Anthropic */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-semibold text-[#00204a] mb-1">Anthropic — Claude AI (Kogi)</h2>
            <p className="text-sm text-muted-foreground mb-4">API para o agente de inteligência artificial</p>
            <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 border border-border">
              <div><span className="text-[#00204a]">ANTHROPIC_API_KEY</span>=sk-ant-...</div>
            </div>
          </div>

          {/* Resend */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-semibold text-[#00204a] mb-1">Resend — E-mail Transacional</h2>
            <p className="text-sm text-muted-foreground mb-4">Envio de notificações por e-mail para os guias</p>
            <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 border border-border">
              <div><span className="text-[#00204a]">RESEND_API_KEY</span>=re_...</div>
              <div><span className="text-[#00204a]">RESEND_FROM_EMAIL</span>=noreply@koglinviagens.com.br</div>
            </div>
          </div>

          {/* Supabase */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-semibold text-[#00204a] mb-1">Supabase — Banco de Dados</h2>
            <p className="text-sm text-muted-foreground mb-4">PostgreSQL + Auth + Realtime</p>
            <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 border border-border">
              <div><span className="text-[#00204a]">NEXT_PUBLIC_SUPABASE_URL</span>=https://xxx.supabase.co</div>
              <div><span className="text-[#00204a]">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=eyJ...</div>
              <div><span className="text-[#00204a]">SUPABASE_SERVICE_ROLE_KEY</span>=eyJ...</div>
            </div>
          </div>

          <div className="bg-[#fcb900]/10 border border-[#fcb900]/30 p-4 text-sm text-[#a07800]">
            <strong>Segurança:</strong> Nunca armazene chaves de API no banco de dados. Use sempre variáveis de ambiente.
            No Vercel, acesse <strong>Project → Settings → Environment Variables</strong>.
          </div>
        </div>
      </main>
    </div>
  )
}
