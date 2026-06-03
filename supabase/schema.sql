-- ============================================================
-- KOGLIN VIAGENS - Supabase Schema
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELA: users (perfis vinculados ao Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'collaborator', 'guide')),
  phone       TEXT,
  whatsapp    TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: groups
-- ============================================================
CREATE TABLE IF NOT EXISTS public.groups (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  guide_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: passengers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.passengers (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id           UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  first_name         TEXT NOT NULL,
  last_name          TEXT NOT NULL,
  birth_date         DATE,
  passport_number    TEXT,
  email              TEXT,
  phone              TEXT,
  whatsapp           TEXT,
  company_name       TEXT,
  -- Hotel
  hotel_name         TEXT,
  room_category      TEXT,
  bed_type           TEXT,
  checkin_date       DATE,
  checkout_date      DATE,
  -- Embarque (ida)
  departure_airline  TEXT,
  departure_airport  TEXT,
  departure_date     DATE,
  departure_time     TIME,
  -- Retorno
  return_airline     TEXT,
  return_airport     TEXT,
  return_date        DATE,
  return_time        TIME,
  -- Navio/Cruzeiro
  ship_number        TEXT,
  deck               TEXT,
  cabin_category     TEXT,
  cabin_type         TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: tickets
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passenger_id       UUID REFERENCES public.passengers(id) ON DELETE SET NULL,
  group_id           UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  guide_id           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  category           TEXT NOT NULL CHECK (category IN ('hotel', 'ship', 'flight', 'transfer', 'other')),
  status             TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  description        TEXT NOT NULL,
  passenger_whatsapp TEXT,
  resolved_at        TIMESTAMPTZ,
  resolution_notes   TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: ticket_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id  UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  sender     TEXT NOT NULL CHECK (sender IN ('passenger', 'agent_ai', 'guide', 'system')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: knowledge_base
-- ============================================================
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category   TEXT NOT NULL,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: whatsapp_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_sessions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passenger_whatsapp  TEXT NOT NULL UNIQUE,
  passenger_id        UUID REFERENCES public.passengers(id) ON DELETE SET NULL,
  current_ticket_id   UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  last_interaction    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_passengers_updated_at
  BEFORE UPDATE ON public.passengers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: criar perfil ao registrar usuário no Auth
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'guide')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- USERS policies
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (id = auth.uid() OR get_user_role() IN ('admin', 'collaborator'));

CREATE POLICY "users_insert_admin" ON public.users
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "users_update_admin" ON public.users
  FOR UPDATE USING (get_user_role() = 'admin' OR id = auth.uid());

-- GROUPS policies
CREATE POLICY "groups_select_all" ON public.groups
  FOR SELECT USING (
    get_user_role() IN ('admin', 'collaborator')
    OR (get_user_role() = 'guide' AND guide_id = auth.uid())
  );

CREATE POLICY "groups_insert_collab" ON public.groups
  FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'collaborator'));

CREATE POLICY "groups_update_collab" ON public.groups
  FOR UPDATE USING (get_user_role() IN ('admin', 'collaborator'));

CREATE POLICY "groups_delete_admin" ON public.groups
  FOR DELETE USING (get_user_role() = 'admin');

-- PASSENGERS policies
CREATE POLICY "passengers_select" ON public.passengers
  FOR SELECT USING (
    get_user_role() IN ('admin', 'collaborator')
    OR (get_user_role() = 'guide' AND group_id IN (
      SELECT id FROM public.groups WHERE guide_id = auth.uid()
    ))
  );

CREATE POLICY "passengers_insert_collab" ON public.passengers
  FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'collaborator'));

CREATE POLICY "passengers_update_collab" ON public.passengers
  FOR UPDATE USING (get_user_role() IN ('admin', 'collaborator'));

CREATE POLICY "passengers_delete_admin" ON public.passengers
  FOR DELETE USING (get_user_role() = 'admin');

-- TICKETS policies
CREATE POLICY "tickets_select" ON public.tickets
  FOR SELECT USING (
    get_user_role() IN ('admin', 'collaborator')
    OR (get_user_role() = 'guide' AND guide_id = auth.uid())
  );

CREATE POLICY "tickets_insert_all" ON public.tickets
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "tickets_update" ON public.tickets
  FOR UPDATE USING (
    get_user_role() IN ('admin', 'collaborator')
    OR (get_user_role() = 'guide' AND guide_id = auth.uid())
  );

-- TICKET_MESSAGES policies
CREATE POLICY "ticket_messages_select" ON public.ticket_messages
  FOR SELECT USING (
    ticket_id IN (SELECT id FROM public.tickets)
  );

CREATE POLICY "ticket_messages_insert" ON public.ticket_messages
  FOR INSERT WITH CHECK (TRUE);

-- KNOWLEDGE_BASE policies
CREATE POLICY "kb_select_active" ON public.knowledge_base
  FOR SELECT USING (is_active = TRUE OR get_user_role() = 'admin');

CREATE POLICY "kb_insert_admin" ON public.knowledge_base
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "kb_update_admin" ON public.knowledge_base
  FOR UPDATE USING (get_user_role() = 'admin');

CREATE POLICY "kb_delete_admin" ON public.knowledge_base
  FOR DELETE USING (get_user_role() = 'admin');

-- WHATSAPP_SESSIONS policies (service role only via API)
CREATE POLICY "ws_select_admin" ON public.whatsapp_sessions
  FOR SELECT USING (get_user_role() IN ('admin', 'collaborator'));

CREATE POLICY "ws_insert_all" ON public.whatsapp_sessions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "ws_update_all" ON public.whatsapp_sessions
  FOR UPDATE USING (TRUE);

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_passengers_group_id ON public.passengers(group_id);
CREATE INDEX IF NOT EXISTS idx_passengers_whatsapp ON public.passengers(whatsapp);
CREATE INDEX IF NOT EXISTS idx_tickets_guide_id ON public.tickets(guide_id);
CREATE INDEX IF NOT EXISTS idx_tickets_group_id ON public.tickets(group_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_phone ON public.whatsapp_sessions(passenger_whatsapp);

-- ============================================================
-- DADOS DE EXEMPLO: Knowledge Base
-- ============================================================
INSERT INTO public.knowledge_base (category, title, content) VALUES
('Geral', 'Contato de emergência da Koglin Viagens',
 'Em caso de emergência fora do horário comercial, entre em contato pelo WhatsApp: +55 (51) 9XXXX-XXXX. Disponível 24h durante o período de viagem.'),
('Hotel', 'Procedimento de check-in',
 'O check-in nos hotéis ocorre a partir das 14h. Caso chegue antes, a bagagem pode ser guardada na recepção. Apresente o passaporte e o voucher fornecido pela Koglin Viagens.'),
('Hotel', 'Problemas no quarto',
 'Caso haja qualquer problema no quarto (ar-condicionado, encanamento, limpeza), informe imediatamente à recepção do hotel. Se não for resolvido, acione seu guia responsável.'),
('Navio', 'Horários de embarque no navio',
 'O embarque no navio ocorre conforme o itinerário informado. Recomendamos chegar com pelo menos 2 horas de antecedência. Tenha sempre o cartão de embarque e documento de identidade em mãos.'),
('Voo', 'Check-in aéreo',
 'O check-in online pode ser feito 24-48h antes do voo pelo site da companhia aérea. Recomendamos chegar ao aeroporto com 3h de antecedência para voos internacionais e 2h para domésticos.'),
('Voo', 'Bagagem extraviada',
 'Em caso de bagagem extraviada, registre imediatamente um boletim de ocorrência (PIR) no balcão da companhia aérea antes de sair do aeroporto. Guarde o número do protocolo e informe seu guia.'),
('Translado', 'Informações sobre translados',
 'Os translados estão incluídos no pacote conforme descrito no voucher. Fique atento aos horários de saída — veículos não aguardam após 10 minutos do horário marcado.'),
('Documentação', 'Documentos necessários',
 'Para viagens internacionais: passaporte com validade mínima de 6 meses, visto (se necessário), seguro de viagem e comprovante de vacinação (quando exigido pelo destino).'),
('Emergências', 'Procedimento em caso de emergência médica',
 'Em caso de emergência médica, ligue imediatamente para o número de emergência local (equivalente ao 192 no Brasil) e notifique seu guia. O seguro de viagem cobre atendimento médico — guarde todos os recibos.');

-- ============================================================
-- REALTIME: habilitar para tickets e ticket_messages
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
