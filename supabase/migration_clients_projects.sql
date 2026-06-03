-- ============================================================
-- Migration: Clients, Projects, Ticket Categories
-- Execute no Supabase SQL Editor
-- ============================================================

-- 1. Tabela de clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read clients" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage clients" ON public.clients FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','collaborator'))
);

-- 2. Contatos dos clientes
CREATE TABLE IF NOT EXISTS public.client_contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  email text,
  phone text,
  whatsapp text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read client_contacts" ON public.client_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage client_contacts" ON public.client_contacts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','collaborator'))
);

-- 3. Projetos
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  value numeric(12,2),
  start_date date,
  end_date date,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage projects" ON public.projects FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','collaborator'))
);

-- 4. Alocação de guias em projetos
CREATE TABLE IF NOT EXISTS public.project_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);
ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read project_users" ON public.project_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage project_users" ON public.project_users FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','collaborator'))
);

-- 5. Vincular grupos a projetos
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id);

-- 6. Categorias de tickets (com cor)
CREATE TABLE IF NOT EXISTS public.ticket_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#6b7280',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.ticket_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ticket_categories" ON public.ticket_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage ticket_categories" ON public.ticket_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','collaborator'))
);

-- 7. Storage bucket para logos de clientes
INSERT INTO storage.buckets (id, name, public) VALUES ('client-logos', 'client-logos', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public can read client logos" ON storage.objects FOR SELECT USING (bucket_id = 'client-logos');
CREATE POLICY "Authenticated can upload client logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'client-logos');
CREATE POLICY "Authenticated can update client logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'client-logos');
CREATE POLICY "Authenticated can delete client logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'client-logos');

-- ============================================================
-- Dados simulados
-- ============================================================

-- Clientes
INSERT INTO public.clients (id, name) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Ipiranga'),
  ('11111111-0000-0000-0000-000000000002', 'Banco do Brasil'),
  ('11111111-0000-0000-0000-000000000003', 'Natura'),
  ('11111111-0000-0000-0000-000000000004', 'Embraer')
ON CONFLICT DO NOTHING;

-- Contatos dos clientes
INSERT INTO public.client_contacts (client_id, name, role, email, phone, whatsapp) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Carlos Mendes', 'Gerente de Eventos', 'carlos.mendes@ipiranga.com.br', '+5511987654321', '+5511987654321'),
  ('11111111-0000-0000-0000-000000000001', 'Fernanda Costa', 'Coordenadora Comercial', 'fernanda@ipiranga.com.br', '+5511976543210', null),
  ('11111111-0000-0000-0000-000000000002', 'Roberto Alves', 'Diretor de RH', 'r.alves@bb.com.br', '+5561998887766', '+5561998887766'),
  ('11111111-0000-0000-0000-000000000003', 'Patrícia Lima', 'Gerente Comercial', 'patricia.lima@natura.net', '+5511965432109', '+5511965432109'),
  ('11111111-0000-0000-0000-000000000004', 'Eduardo Santos', 'Coordenador de Incentivos', 'e.santos@embraer.com.br', '+5512997654321', null)
ON CONFLICT DO NOTHING;

-- Projetos
INSERT INTO public.projects (id, client_id, name, value, start_date, end_date, description) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Clube do Milhão', 450000, '2025-03-01', '2025-03-10', 'Viagem de incentivo para os top dealers da rede Ipiranga. Destino Cancún, México.'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Convenção Anual 2025', 280000, '2025-08-15', '2025-08-20', 'Convenção nacional de revendedores Ipiranga em Gramado, RS.'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Líderes em Ação', 195000, '2025-11-05', '2025-11-09', 'Programa de incentivo para líderes regionais. Destino Buenos Aires.'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Retiro Executivo Europa', 520000, '2025-05-10', '2025-05-20', 'Viagem de incentivo para diretores do BB. Portugal e Espanha.'),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'Reconhecimento Top Gestores', 310000, '2025-09-22', '2025-09-28', 'Premiação para os melhores gestores da rede BB. Destino Miami.'),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003', 'Consultoras Top 2025', 195000, '2025-06-01', '2025-06-07', 'Premiação das melhores consultoras da Natura. Destino Maldivas.'),
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000004', 'Engenheiros de Elite', 380000, '2025-07-14', '2025-07-21', 'Programa de incentivo para engenheiros destaque. Destino Japão.')
ON CONFLICT DO NOTHING;

-- Categorias de tickets
INSERT INTO public.ticket_categories (name, color) VALUES
  ('Hospedagem', '#3b82f6'),
  ('Transporte', '#10b981'),
  ('Documentação', '#8b5cf6'),
  ('Alimentação', '#f59e0b'),
  ('Emergência', '#ef4444'),
  ('Translado', '#06b6d4'),
  ('Geral', '#6b7280')
ON CONFLICT DO NOTHING;
