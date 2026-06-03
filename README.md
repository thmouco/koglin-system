# Koglin Viagens — Sistema de Gerenciamento de Grupos

Sistema web completo para gerenciar 880 passageiros em 20 grupos de viagem, com suporte via WhatsApp e agente de IA.

**Stack:** Next.js 14 · TypeScript · Supabase · Tailwind CSS · Anthropic Claude · Twilio · Resend

---

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Twilio](https://www.twilio.com) com WhatsApp Business API habilitado
- API Key da [Anthropic](https://console.anthropic.com)
- Conta no [Resend](https://resend.com) para e-mails transacionais

---

## 1. Configurar Supabase

### 1.1 Criar projeto
1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Dê um nome (ex: `koglin-system`) e escolha a região mais próxima (South America - São Paulo)
3. Aguarde a criação do projeto

### 1.2 Executar schema do banco
1. No painel do Supabase → **SQL Editor**
2. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql)
3. Cole e execute todo o conteúdo

### 1.3 Obter as chaves
No painel do Supabase → **Settings → API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ manter secreto)

### 1.4 Configurar Auth
- **Settings → Auth → URL Configuration:**
  - Site URL: `https://seu-projeto.vercel.app`
  - Redirect URLs: `https://seu-projeto.vercel.app/**`

### 1.5 Criar o primeiro usuário Admin
No **SQL Editor** do Supabase:
```sql
-- Após criar o usuário via Auth → Users → Add user, execute:
UPDATE public.users SET role = 'admin' WHERE email = 'seu@email.com';
```

---

## 2. Configurar Twilio

1. Acesse [twilio.com](https://www.twilio.com) → **Console**
2. Ative o **WhatsApp Business API** (Sandbox ou número produção)
3. Em **Messaging → Sandbox Settings** (ou número produtivo):
   - Webhook URL: `https://seu-projeto.vercel.app/api/webhooks/whatsapp`
   - Método: `POST`
4. Colete:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
   - Número WhatsApp → `TWILIO_WHATSAPP_NUMBER` (formato: `whatsapp:+14155238886`)

---

## 3. Configurar Resend

1. Acesse [resend.com](https://resend.com) → **API Keys → Create API Key**
2. Configure um domínio remetente (ou use o domínio de teste)
3. Colete a chave → `RESEND_API_KEY`

---

## 4. Deploy no Vercel

### 4.1 Fork/clone o repositório
```bash
git clone <repo>
cd koglin-system
```

### 4.2 Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
```

Ou conecte o repositório GitHub diretamente no painel do Vercel.

### 4.3 Variáveis de Ambiente
No painel do Vercel → **Project → Settings → Environment Variables**, adicione:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (secreta) |
| `ANTHROPIC_API_KEY` | API Key da Anthropic |
| `TWILIO_ACCOUNT_SID` | Account SID do Twilio |
| `TWILIO_AUTH_TOKEN` | Auth Token do Twilio |
| `TWILIO_WHATSAPP_NUMBER` | Número WhatsApp Twilio (ex: `whatsapp:+14155238886`) |
| `RESEND_API_KEY` | API Key do Resend |
| `RESEND_FROM_EMAIL` | E-mail remetente (ex: `noreply@koglinviagens.com.br`) |
| `NEXT_PUBLIC_APP_URL` | URL pública do app (ex: `https://koglin.vercel.app`) |

### 4.4 Deploy
```bash
vercel --prod
```

---

## 5. Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas chaves

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Arquitetura

```
koglin-system/
├── app/
│   ├── (auth)/login/          # Página de login
│   ├── (admin)/               # Layout admin/colaborador
│   │   ├── dashboard/         # KPIs + gráficos
│   │   ├── groups/            # CRUD de grupos
│   │   ├── passengers/        # CRUD + importação CSV
│   │   ├── tickets/           # Todos os tickets
│   │   ├── users/             # Gestão de usuários
│   │   └── settings/          # Base de conhecimento + integrações
│   ├── (guide)/               # Layout do guia
│   │   ├── tickets/           # Tickets do guia
│   │   └── my-group/          # Passageiros do grupo
│   └── api/
│       ├── webhooks/whatsapp/ # Webhook Twilio → Kogi
│       └── users/invite/      # Convite por e-mail
├── components/
│   ├── ui/                    # Button, Input, Card, Dialog, etc.
│   ├── dashboard/             # KPICards, DashboardCharts, GuideRanking
│   ├── tickets/               # TicketsClient
│   └── layout/                # Sidebar, Header, AppShell
├── lib/
│   ├── supabase/              # client.ts, server.ts, middleware.ts
│   ├── anthropic.ts           # Cliente Anthropic
│   ├── twilio.ts              # Cliente Twilio
│   ├── resend.ts              # Template email
│   └── ai-agent.ts            # Lógica do Kogi
├── types/index.ts             # Todos os tipos TypeScript
├── supabase/schema.sql        # Schema completo do banco
└── middleware.ts              # Proteção de rotas por role
```

---

## Roles e Permissões

| Funcionalidade | Admin | Colaborador | Guia |
|---------------|-------|-------------|------|
| Dashboard gráficos | ✅ | ✅ | ❌ |
| Gestão de Grupos | ✅ | ✅ | ❌ |
| Gestão de Passageiros | ✅ | ✅ | Ver próprio grupo |
| Todos os Tickets | ✅ | Ver (somente) | Próprios tickets |
| Gestão de Usuários | ✅ | ❌ | ❌ |
| Base de Conhecimento | ✅ | ❌ | ❌ |
| Configurações | ✅ | ❌ | ❌ |

---

## Fluxo do Agente Kogi (WhatsApp)

```
Passageiro envia mensagem
         ↓
  Webhook Twilio (POST /api/webhooks/whatsapp)
         ↓
  Identifica passageiro pelo WhatsApp
         ↓
  Busca guia e dados do grupo
         ↓
  Carrega base de conhecimento
         ↓
  Envia para Claude (claude-sonnet-4-6)
         ↓
  ┌──────────────────────────────┐
  │ É dúvida?                    │
  │   SIM + KB tem resposta      │→ Responde direto ao passageiro
  │   SIM + KB não tem resposta  │→ Cria ticket, responde "colaborador entrará em contato"
  │ É reclamação/problema?       │→ Cria ticket, notifica guia (WhatsApp + E-mail)
  └──────────────────────────────┘
```

---

## CSV de Importação

Colunas aceitas pelo importador:

| Nome | Sobrenome | E-mail | WhatsApp | Passaporte | Empresa | Hotel | Categoria Quarto | Tipo Cama | Check-in | Check-out | Cia. Ida | Aeroporto Ida | Data Ida | Hora Ida | Cia. Volta | Aeroporto Volta | Data Volta | Hora Volta | Navio | Deck | Cat. Cabine | Tipo Cabine |

---

## Suporte

Dúvidas sobre o sistema? Acesse as configurações em **Base de Conhecimento** ou entre em contato com o administrador do sistema.
