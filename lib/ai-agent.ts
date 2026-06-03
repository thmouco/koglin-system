import { anthropic } from './anthropic'
import type { Passenger, User, KnowledgeBase } from '@/types'

interface AgentInput {
  message: string
  passenger: Passenger | null
  guide: User | null
  knowledgeBase: KnowledgeBase[]
}

interface AgentOutput {
  reply: string
  intent: 'question_answered' | 'question_unanswered' | 'complaint' | 'general'
  category: 'hotel' | 'ship' | 'flight' | 'transfer' | 'other'
  shouldCreateTicket: boolean
}

function buildSystemPrompt(passenger: Passenger | null, guide: User | null, kb: KnowledgeBase[]): string {
  const passengerContext = passenger
    ? `
DADOS DO PASSAGEIRO:
- Nome: ${passenger.first_name} ${passenger.last_name}
- Grupo: ${(passenger as any).group?.name ?? 'N/A'}
- Guia responsável: ${guide?.full_name ?? 'N/A'}
- Hotel: ${passenger.hotel_name ?? 'N/A'} (check-in: ${passenger.checkin_date ?? 'N/A'}, check-out: ${passenger.checkout_date ?? 'N/A'})
- Voo de ida: ${passenger.departure_airline ?? 'N/A'} — ${passenger.departure_date ?? 'N/A'} às ${passenger.departure_time ?? 'N/A'}
- Voo de retorno: ${passenger.return_airline ?? 'N/A'} — ${passenger.return_date ?? 'N/A'} às ${passenger.return_time ?? 'N/A'}
- Navio: ${passenger.ship_number ?? 'N/A'} — Deck ${passenger.deck ?? 'N/A'}, Cabine ${passenger.cabin_category ?? 'N/A'}
`.trim()
    : 'PASSAGEIRO: Não identificado no sistema.'

  const kbContext = kb.length > 0
    ? `\nBASE DE CONHECIMENTO:\n${kb.map(k => `[${k.category}] ${k.title}:\n${k.content}`).join('\n\n---\n')}`
    : '\nBASE DE CONHECIMENTO: Nenhum artigo disponível.'

  return `Você é o Kogi, assistente virtual da Koglin Viagens, agência parceira Lufthansa City Center.
Você atende passageiros que estão em viagem e precisam de suporte via WhatsApp.

REGRAS OBRIGATÓRIAS:
1. Seja sempre educado, objetivo e empático
2. Responda APENAS com base nas informações da base de conhecimento fornecida
3. Se for uma DÚVIDA que você consegue responder com a base de conhecimento: responda diretamente
4. Se for uma DÚVIDA que você NÃO sabe responder: informe que um colaborador entrará em contato em breve
5. Se o passageiro relatar um PROBLEMA ou RECLAMAÇÃO: confirme que registrou e que o guia foi notificado
6. Identifique sempre a categoria: hotel, navio (ship), voo (flight), translado (transfer) ou outros (other)
7. NUNCA invente informações. NUNCA prometa prazos específicos.
8. Responda SEMPRE em português brasileiro
9. Mantenha respostas curtas para WhatsApp (máximo 3 parágrafos curtos)
10. Use emojis com moderação para tornar as mensagens mais amigáveis

${passengerContext}
${kbContext}`
}

const CATEGORY_KEYWORDS = {
  hotel: ['hotel', 'quarto', 'check-in', 'checkout', 'cama', 'hospedagem', 'recepção', 'limpeza', 'ar-condicionado'],
  ship: ['navio', 'cruzeiro', 'cabine', 'deck', 'embarque', 'porto', 'bordo'],
  flight: ['voo', 'avião', 'aeroporto', 'bagagem', 'check-in', 'companhia aérea', 'embarque', 'passagem'],
  transfer: ['translado', 'transfer', 'ônibus', 'veículo', 'transporte', 'van', 'motorista'],
}

function detectCategory(text: string): AgentOutput['category'] {
  const lower = text.toLowerCase()
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) return cat as AgentOutput['category']
  }
  return 'other'
}

const COMPLAINT_KEYWORDS = [
  'problema', 'reclamação', 'reclamar', 'defeito', 'quebrado', 'não funciona',
  'ruim', 'péssimo', 'horrível', 'errado', 'cancelado', 'atrasado', 'perdido',
  'sumiram', 'roubado', 'machucado', 'doente', 'emergência', 'urgente',
  'fui enganado', 'cobrança indevida', 'não apareceu', 'não veio',
]

export async function runKogiAgent(input: AgentInput): Promise<AgentOutput> {
  const { message, passenger, guide, knowledgeBase } = input

  const systemPrompt = buildSystemPrompt(passenger, guide, knowledgeBase)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: message,
      },
    ],
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''
  const category = detectCategory(message)

  const isComplaint = COMPLAINT_KEYWORDS.some(kw => message.toLowerCase().includes(kw))
  const isUnanswered = reply.toLowerCase().includes('colaborador entrará em contato') ||
    reply.toLowerCase().includes('entrar em contato em breve')

  let intent: AgentOutput['intent']
  let shouldCreateTicket: boolean

  if (isComplaint) {
    intent = 'complaint'
    shouldCreateTicket = true
  } else if (isUnanswered) {
    intent = 'question_unanswered'
    shouldCreateTicket = true
  } else {
    intent = 'question_answered'
    shouldCreateTicket = false
  }

  return { reply, intent, category, shouldCreateTicket }
}
