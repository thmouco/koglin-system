export type UserRole = 'admin' | 'collaborator' | 'guide'

export type TicketCategory = 'hotel' | 'ship' | 'flight' | 'transfer' | 'other'

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type MessageSender = 'passenger' | 'agent_ai' | 'guide' | 'system'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  whatsapp?: string
  created_at: string
}

export interface Group {
  id: string
  name: string
  guide_id: string
  description?: string
  created_at: string
  guide?: User
  passenger_count?: number
}

export interface Passenger {
  id: string
  group_id: string
  first_name: string
  last_name: string
  birth_date?: string
  passport_number?: string
  email?: string
  phone?: string
  whatsapp?: string
  company_name?: string
  hotel_name?: string
  room_category?: string
  bed_type?: string
  checkin_date?: string
  checkout_date?: string
  departure_airline?: string
  departure_airport?: string
  departure_date?: string
  departure_time?: string
  return_airline?: string
  return_airport?: string
  return_date?: string
  return_time?: string
  ship_number?: string
  deck?: string
  cabin_category?: string
  cabin_type?: string
  created_at: string
  updated_at: string
  group?: Group
}

export interface Ticket {
  id: string
  passenger_id: string
  group_id: string
  guide_id: string
  category: TicketCategory
  status: TicketStatus
  description: string
  passenger_whatsapp?: string
  resolved_at?: string
  resolution_notes?: string
  created_at: string
  updated_at: string
  passenger?: Passenger
  guide?: User
  group?: Group
  messages?: TicketMessage[]
}

export interface TicketMessage {
  id: string
  ticket_id: string
  sender: MessageSender
  content: string
  created_at: string
}

export interface KnowledgeBase {
  id: string
  category: string
  title: string
  content: string
  is_active: boolean
  created_at: string
}

export interface WhatsAppSession {
  id: string
  passenger_whatsapp: string
  passenger_id?: string
  current_ticket_id?: string
  last_interaction: string
  created_at: string
}

export interface DashboardStats {
  open_tickets: number
  resolved_today: number
  avg_resolution_hours: number
  same_day_rate: number
  unattended_2h: number
}

export interface GuideStats {
  guide_id: string
  guide_name: string
  group_name: string
  open_tickets: number
  resolved_tickets: number
  avg_resolution_hours: number
  last_ticket_at?: string
}
