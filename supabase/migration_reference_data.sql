-- ============================================================
-- Migration: Reference Data + birth_date
-- Execute no Supabase SQL Editor
-- ============================================================

-- 1. Adicionar data de nascimento nos passageiros
ALTER TABLE public.passengers ADD COLUMN IF NOT EXISTS birth_date date;

-- 2. Tabela de companhias aéreas
CREATE TABLE IF NOT EXISTS public.airlines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  iata_code varchar(3),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.airlines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read airlines" ON public.airlines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage airlines" ON public.airlines FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','collaborator'))
);

-- 3. Tabela de companhias de cruzeiro
CREATE TABLE IF NOT EXISTS public.cruise_lines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.cruise_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read cruise_lines" ON public.cruise_lines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage cruise_lines" ON public.cruise_lines FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','collaborator'))
);

-- 4. Tabela de tipos de cama
CREATE TABLE IF NOT EXISTS public.bed_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.bed_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read bed_types" ON public.bed_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage bed_types" ON public.bed_types FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','collaborator'))
);

-- 5. Dados iniciais
INSERT INTO public.airlines (name, iata_code) VALUES
  ('LATAM Airlines', 'LA'), ('GOL Linhas Aéreas', 'G3'), ('Azul Linhas Aéreas', 'AD'),
  ('American Airlines', 'AA'), ('United Airlines', 'UA'), ('Delta Air Lines', 'DL'),
  ('Air France', 'AF'), ('Lufthansa', 'LH'), ('British Airways', 'BA'),
  ('Iberia', 'IB'), ('TAP Air Portugal', 'TP'), ('KLM', 'KL'),
  ('Swiss International', 'LX'), ('Turkish Airlines', 'TK'), ('Emirates', 'EK'),
  ('Qatar Airways', 'QR'), ('Air Canada', 'AC'), ('Japan Airlines', 'JL'),
  ('Singapore Airlines', 'SQ'), ('Alitalia / ITA Airways', 'AZ')
ON CONFLICT DO NOTHING;

INSERT INTO public.cruise_lines (name) VALUES
  ('MSC Cruzeiros'), ('Royal Caribbean'), ('Carnival Cruise Line'),
  ('Norwegian Cruise Line'), ('Costa Cruzeiros'), ('Celebrity Cruises'),
  ('Princess Cruises'), ('Holland America Line'), ('Regent Seven Seas'),
  ('Crystal Cruises'), ('Cunard'), ('Silversea Cruises')
ON CONFLICT DO NOTHING;

INSERT INTO public.bed_types (name) VALUES
  ('Casal'), ('Solteiro'), ('Twin'), ('King'), ('Queen'), ('Beliche')
ON CONFLICT DO NOTHING;
