-- ============================================================
-- SEED: Dados simulados para Koglin Viagens
-- 5 grupos + 100 passageiros + tickets de exemplo
-- Execute APÓS o schema.sql
-- ============================================================

-- 1. Inserir guias em auth.users (requisito FK do Supabase)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud)
VALUES
  ('11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'carlos.silva@koglin.com', crypt('Koglin2026!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated', 'authenticated'),
  ('11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'ana.souza@koglin.com', crypt('Koglin2026!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated', 'authenticated'),
  ('11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'pedro.santos@koglin.com', crypt('Koglin2026!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated', 'authenticated'),
  ('11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'lucia.ferreira@koglin.com', crypt('Koglin2026!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated', 'authenticated'),
  ('11111111-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'marcos.oliveira@koglin.com', crypt('Koglin2026!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', false, 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 2. O trigger handle_new_user cria public.users automaticamente.
--    Aguardar um momento não é necessário no SQL síncrono — o trigger roda na mesma transação.
--    Mas se o trigger não existir, inserimos manualmente:
INSERT INTO public.users (id, email, full_name, role, phone, whatsapp)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'carlos.silva@koglin.com', 'Carlos Silva', 'guide', '+5551991110001', '+5551991110001'),
  ('11111111-0000-0000-0000-000000000002', 'ana.souza@koglin.com', 'Ana Souza', 'guide', '+5551991110002', '+5551991110002'),
  ('11111111-0000-0000-0000-000000000003', 'pedro.santos@koglin.com', 'Pedro Santos', 'guide', '+5551991110003', '+5551991110003'),
  ('11111111-0000-0000-0000-000000000004', 'lucia.ferreira@koglin.com', 'Lúcia Ferreira', 'guide', '+5551991110004', '+5551991110004'),
  ('11111111-0000-0000-0000-000000000005', 'marcos.oliveira@koglin.com', 'Marcos Oliveira', 'guide', '+5551991110005', '+5551991110005')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp;

-- 3. Grupos
INSERT INTO public.groups (id, name, guide_id, description) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Grupo Europa A', '11111111-0000-0000-0000-000000000001', 'Roteiro por Portugal, Espanha e França'),
  ('22222222-0000-0000-0000-000000000002', 'Grupo Mediterrâneo B', '11111111-0000-0000-0000-000000000002', 'Cruzeiro pelo Mediterrâneo'),
  ('22222222-0000-0000-0000-000000000003', 'Grupo América do Norte C', '11111111-0000-0000-0000-000000000003', 'EUA e Canadá'),
  ('22222222-0000-0000-0000-000000000004', 'Grupo Ásia D', '11111111-0000-0000-0000-000000000004', 'Japão e Tailândia'),
  ('22222222-0000-0000-0000-000000000005', 'Grupo Caribe E', '11111111-0000-0000-0000-000000000005', 'Cruzeiro pelo Caribe')
ON CONFLICT (id) DO NOTHING;

-- 4. 100 Passageiros (20 por grupo)
INSERT INTO public.passengers (group_id, first_name, last_name, email, phone, whatsapp, passport_number, company_name, hotel_name, room_category, bed_type, checkin_date, checkout_date, departure_airline, departure_airport, departure_date, departure_time, return_airline, return_airport, return_date, return_time, ship_number, deck, cabin_category, cabin_type) VALUES

-- GRUPO 1: Europa A
('22222222-0000-0000-0000-000000000001','Roberto','Almeida','roberto.almeida@email.com','+5551999001001','+5551999001001','BR1000001','Almeida Engenharia','Hotel Ibis Lisboa','Standard','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Fernanda','Costa','fernanda.costa@email.com','+5551999001002','+5551999001002','BR1000002','Costa Ltda','Hotel Ibis Lisboa','Superior','Solteiro','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Paulo','Martins','paulo.martins@email.com','+5551999001003','+5551999001003','BR1000003','Martins & Cia','Hotel NH Madrid','Standard','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Juliana','Rocha','juliana.rocha@email.com','+5551999001004','+5551999001004','BR1000004','Rocha Imóveis','Hotel NH Madrid','Superior','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Eduardo','Lima','eduardo.lima@email.com','+5551999001005','+5551999001005','BR1000005','Lima Tech','Hotel Mercure Paris','Standard','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Camila','Pereira','camila.pereira@email.com','+5551999001006','+5551999001006','BR1000006','Pereira Consultoria','Hotel Mercure Paris','Superior','Solteiro','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Bruno','Cardoso','bruno.cardoso@email.com','+5551999001007','+5551999001007','BR1000007','Cardoso Advogados','Hotel Ibis Lisboa','Standard','Solteiro','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Amanda','Gomes','amanda.gomes@email.com','+5551999001008','+5551999001008','BR1000008','Gomes & Filhos','Hotel NH Madrid','Standard','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Ricardo','Fernandes','ricardo.fernandes@email.com','+5551999001009','+5551999001009','BR1000009','Fernandes SA','Hotel Mercure Paris','Suite','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Mariana','Barbosa','mariana.barbosa@email.com','+5551999001010','+5551999001010','BR1000010','Barbosa Moda','Hotel Ibis Lisboa','Standard','Solteiro','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Thiago','Nascimento','thiago.nascimento@email.com','+5551999001011','+5551999001011','BR1000011','Nascimento Corp','Hotel NH Madrid','Superior','Solteiro','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Patricia','Araujo','patricia.araujo@email.com','+5551999001012','+5551999001012','BR1000012','Araujo Farmácia','Hotel Mercure Paris','Standard','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Diego','Mendes','diego.mendes@email.com','+5551999001013','+5551999001013','BR1000013','Mendes Transporte','Hotel Ibis Lisboa','Standard','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Larissa','Nunes','larissa.nunes@email.com','+5551999001014','+5551999001014','BR1000014','Nunes Joias','Hotel NH Madrid','Superior','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Felipe','Ribeiro','felipe.ribeiro@email.com','+5551999001015','+5551999001015','BR1000015','Ribeiro Seguros','Hotel Mercure Paris','Suite','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Vanessa','Teixeira','vanessa.teixeira@email.com','+5551999001016','+5551999001016','BR1000016','Teixeira Design','Hotel Ibis Lisboa','Standard','Solteiro','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Rodrigo','Carvalho','rodrigo.carvalho@email.com','+5551999001017','+5551999001017','BR1000017','Carvalho Construtora','Hotel NH Madrid','Standard','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Aline','Sousa','aline.sousa@email.com','+5551999001018','+5551999001018','BR1000018','Sousa Clínica','Hotel Mercure Paris','Standard','Solteiro','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Lucas','Pinto','lucas.pinto@email.com','+5551999001019','+5551999001019','BR1000019','Pinto Automóveis','Hotel Ibis Lisboa','Superior','Casal','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000001','Renata','Moreira','renata.moreira@email.com','+5551999001020','+5551999001020','BR1000020','Moreira Eventos','Hotel Mercure Paris','Superior','Solteiro','2026-06-10','2026-06-20','LATAM','GRU','2026-06-10','09:00','LATAM','GRU','2026-06-20','18:00',NULL,NULL,NULL,NULL),

-- GRUPO 2: Mediterrâneo B (cruzeiro)
('22222222-0000-0000-0000-000000000002','Alexandre','Cruz','alexandre.cruz@email.com','+5551999002001','+5551999002001','BR2000001','Cruz Indústria',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','7','Balcony','Casal'),
('22222222-0000-0000-0000-000000000002','Beatriz','Dias','beatriz.dias@email.com','+5551999002002','+5551999002002','BR2000002','Dias Moda',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','8','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000002','Claudio','Vieira','claudio.vieira@email.com','+5551999002003','+5551999002003','BR2000003','Vieira Logística',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','9','Suite','Casal'),
('22222222-0000-0000-0000-000000000002','Daniela','Monteiro','daniela.monteiro@email.com','+5551999002004','+5551999002004','BR2000004','Monteiro RH',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','7','Balcony','Solteiro'),
('22222222-0000-0000-0000-000000000002','Emerson','Correia','emerson.correia@email.com','+5551999002005','+5551999002005','BR2000005','Correia TI',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','10','Interior','Casal'),
('22222222-0000-0000-0000-000000000002','Fabiana','Azevedo','fabiana.azevedo@email.com','+5551999002006','+5551999002006','BR2000006','Azevedo Saúde',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','8','Balcony','Casal'),
('22222222-0000-0000-0000-000000000002','Gabriel','Melo','gabriel.melo@email.com','+5551999002007','+5551999002007','BR2000007','Melo Advocacia',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','9','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000002','Helena','Fonseca','helena.fonseca@email.com','+5551999002008','+5551999002008','BR2000008','Fonseca Arquitetura',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','7','Suite','Casal'),
('22222222-0000-0000-0000-000000000002','Igor','Campos','igor.campos@email.com','+5551999002009','+5551999002009','BR2000009','Campos Agro',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','10','Balcony','Casal'),
('22222222-0000-0000-0000-000000000002','Joana','Cavalcante','joana.cavalcante@email.com','+5551999002010','+5551999002010','BR2000010','Cavalcante Turismo',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','8','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000002','Kevin','Brito','kevin.brito@email.com','+5551999002011','+5551999002011','BR2000011','Brito Eletro',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','9','Balcony','Solteiro'),
('22222222-0000-0000-0000-000000000002','Leticia','Barreto','leticia.barreto@email.com','+5551999002012','+5551999002012','BR2000012','Barreto Alimentos',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','7','Interior','Casal'),
('22222222-0000-0000-0000-000000000002','Mateus','Ramos','mateus.ramos@email.com','+5551999002013','+5551999002013','BR2000013','Ramos Contabil',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','10','Suite','Casal'),
('22222222-0000-0000-0000-000000000002','Natalia','Guimaraes','natalia.guimaraes@email.com','+5551999002014','+5551999002014','BR2000014','Guimarães Ótica',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','8','Balcony','Solteiro'),
('22222222-0000-0000-0000-000000000002','Otavio','Cunha','otavio.cunha@email.com','+5551999002015','+5551999002015','BR2000015','Cunha Energia',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','9','Interior','Casal'),
('22222222-0000-0000-0000-000000000002','Priscila','Lopes','priscila.lopes@email.com','+5551999002016','+5551999002016','BR2000016','Lopes Mídias',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','7','Suite','Solteiro'),
('22222222-0000-0000-0000-000000000002','Quintino','Freitas','quintino.freitas@email.com','+5551999002017','+5551999002017','BR2000017','Freitas Gráfica',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','10','Balcony','Casal'),
('22222222-0000-0000-0000-000000000002','Raquel','Miranda','raquel.miranda@email.com','+5551999002018','+5551999002018','BR2000018','Miranda Nutrição',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','8','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000002','Sergio','Andrade','sergio.andrade@email.com','+5551999002019','+5551999002019','BR2000019','Andrade Shoes',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','9','Balcony','Casal'),
('22222222-0000-0000-0000-000000000002','Tatiana','Borges','tatiana.borges@email.com','+5551999002020','+5551999002020','BR2000020','Borges Pharma',NULL,NULL,NULL,'2026-07-05','2026-07-15','GOL','CGH','2026-07-05','07:00','GOL','CGH','2026-07-15','20:00','MSC Grandiosa','7','Suite','Solteiro'),

-- GRUPO 3: América do Norte C
('22222222-0000-0000-0000-000000000003','Ulisses','Macedo','ulisses.macedo@email.com','+5551999003001','+5551999003001','BR3000001','Macedo Roupas','Marriott Times Square','Standard','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Vera','Nogueira','vera.nogueira@email.com','+5551999003002','+5551999003002','BR3000002','Nogueira Pet','Marriott Times Square','Superior','Solteiro','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Wagner','Peixoto','wagner.peixoto@email.com','+5551999003003','+5551999003003','BR3000003','Peixoto Inox','Hilton Midtown','Standard','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Ximena','Queiroz','ximena.queiroz@email.com','+5551999003004','+5551999003004','BR3000004','Queiroz Plásticos','Hilton Midtown','Superior','Solteiro','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Yago','Rezende','yago.rezende@email.com','+5551999003005','+5551999003005','BR3000005','Rezende Madeiras','Westin Bonaventure','Standard','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Zelia','Sampaio','zelia.sampaio@email.com','+5551999003006','+5551999003006','BR3000006','Sampaio Bolsas','Westin Bonaventure','Superior','Solteiro','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Andre','Tavares','andre.tavares@email.com','+5551999003007','+5551999003007','BR3000007','Tavares Security','Marriott Times Square','Suite','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Bianca','Lacerda','bianca.lacerda@email.com','+5551999003008','+5551999003008','BR3000008','Lacerda Imóveis','Hilton Midtown','Standard','Solteiro','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Caio','Figueiredo','caio.figueiredo@email.com','+5551999003009','+5551999003009','BR3000009','Figueiredo Auto','Westin Bonaventure','Superior','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Debora','Siqueira','debora.siqueira@email.com','+5551999003010','+5551999003010','BR3000010','Siqueira Cerâmica','Marriott Times Square','Standard','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Elvis','Rolim','elvis.rolim@email.com','+5551999003011','+5551999003011','BR3000011','Rolim Papelaria','Hilton Midtown','Superior','Solteiro','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Flavia','Bastos','flavia.bastos@email.com','+5551999003012','+5551999003012','BR3000012','Bastos Odonto','Westin Bonaventure','Suite','Solteiro','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Gustavo','Pinheiro','gustavo.pinheiro@email.com','+5551999003013','+5551999003013','BR3000013','Pinheiro Veículos','Marriott Times Square','Standard','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Heloisa','Machado','heloisa.machado@email.com','+5551999003014','+5551999003014','BR3000014','Machado Decoração','Hilton Midtown','Superior','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Ivan','Carneiro','ivan.carneiro@email.com','+5551999003015','+5551999003015','BR3000015','Carneiro Elétrica','Westin Bonaventure','Standard','Solteiro','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Juliana','Pacheco','juliana.pacheco@email.com','+5551999003016','+5551999003016','BR3000016','Pacheco Vidros','Marriott Times Square','Superior','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Karina','Domingues','karina.domingues@email.com','+5551999003017','+5551999003017','BR3000017','Domingues Café','Hilton Midtown','Standard','Solteiro','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Leandro','Esteves','leandro.esteves@email.com','+5551999003018','+5551999003018','BR3000018','Esteves Gráfica','Westin Bonaventure','Superior','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Monica','Galvao','monica.galvao@email.com','+5551999003019','+5551999003019','BR3000019','Galvão Joias','Marriott Times Square','Suite','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000003','Nilton','Vasconcelos','nilton.vasconcelos@email.com','+5551999003020','+5551999003020','BR3000020','Vasconcelos Tech','Hilton Midtown','Standard','Casal','2026-08-01','2026-08-12','American Airlines','GRU','2026-08-01','06:00','American Airlines','GRU','2026-08-12','22:00',NULL,NULL,NULL,NULL),

-- GRUPO 4: Ásia D
('22222222-0000-0000-0000-000000000004','Osmar','Falcao','osmar.falcao@email.com','+5551999004001','+5551999004001','BR4000001','Falcão Cervejas','Hotel Shinjuku Granbell','Standard','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Paula','Henrique','paula.henrique@email.com','+5551999004002','+5551999004002','BR4000002','Henrique Cosmética','Hotel Shinjuku Granbell','Superior','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Quintino','Amaral','quintino.amaral@email.com','+5551999004003','+5551999004003','BR4000003','Amaral Frango','Park Hyatt Tokyo','Standard','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Rosa','Iglesias','rosa.iglesias@email.com','+5551999004004','+5551999004004','BR4000004','Iglesias Buffet','Park Hyatt Tokyo','Suite','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Silvio','Brandao','silvio.brandao@email.com','+5551999004005','+5551999004005','BR4000005','Brandão Tintas','Mandarin Oriental Bangkok','Superior','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Tania','Muniz','tania.muniz@email.com','+5551999004006','+5551999004006','BR4000006','Muniz Floricultura','Mandarin Oriental Bangkok','Standard','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Umberto','Coutinho','umberto.coutinho@email.com','+5551999004007','+5551999004007','BR4000007','Coutinho Seguros','Hotel Shinjuku Granbell','Standard','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Veronica','Paiva','veronica.paiva@email.com','+5551999004008','+5551999004008','BR4000008','Paiva Advocacia','Park Hyatt Tokyo','Superior','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Wilson','Moraes','wilson.moraes@email.com','+5551999004009','+5551999004009','BR4000009','Moraes Outdoor','Mandarin Oriental Bangkok','Standard','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Xandra','Neves','xandra.neves@email.com','+5551999004010','+5551999004010','BR4000010','Neves Aluguel','Hotel Shinjuku Granbell','Suite','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Yara','Abreu','yara.abreu@email.com','+5551999004011','+5551999004011','BR4000011','Abreu Têxtil','Park Hyatt Tokyo','Standard','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Zuleika','Becker','zuleika.becker@email.com','+5551999004012','+5551999004012','BR4000012','Becker Móveis','Mandarin Oriental Bangkok','Superior','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Artur','Drummond','artur.drummond@email.com','+5551999004013','+5551999004013','BR4000013','Drummond Eventos','Hotel Shinjuku Granbell','Standard','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Brenda','Couto','brenda.couto@email.com','+5551999004014','+5551999004014','BR4000014','Couto Climatização','Park Hyatt Tokyo','Superior','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Cesar','Godinho','cesar.godinho@email.com','+5551999004015','+5551999004015','BR4000015','Godinho Saúde','Mandarin Oriental Bangkok','Suite','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Denise','Henriques','denise.henriques@email.com','+5551999004016','+5551999004016','BR4000016','Henriques Brindes','Hotel Shinjuku Granbell','Standard','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Elton','Jansen','elton.jansen@email.com','+5551999004017','+5551999004017','BR4000017','Jansen Refrigeração','Park Hyatt Tokyo','Superior','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Fatima','Kirchner','fatima.kirchner@email.com','+5551999004018','+5551999004018','BR4000018','Kirchner Importados','Mandarin Oriental Bangkok','Standard','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Gilson','Luz','gilson.luz@email.com','+5551999004019','+5551999004019','BR4000019','Luz Digital','Hotel Shinjuku Granbell','Superior','Casal','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),
('22222222-0000-0000-0000-000000000004','Hannah','Medeiros','hannah.medeiros@email.com','+5551999004020','+5551999004020','BR4000020','Medeiros Óleo','Park Hyatt Tokyo','Standard','Solteiro','2026-09-05','2026-09-18','Japan Airlines','GRU','2026-09-05','11:00','Japan Airlines','GRU','2026-09-18','14:00',NULL,NULL,NULL,NULL),

-- GRUPO 5: Caribe E (cruzeiro)
('22222222-0000-0000-0000-000000000005','Ingrid','Neto','ingrid.neto@email.com','+5551999005001','+5551999005001','BR5000001','Neto Construtora',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','10','Balcony','Casal'),
('22222222-0000-0000-0000-000000000005','Jorge','Oda','jorge.oda@email.com','+5551999005002','+5551999005002','BR5000002','Oda Sushi',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','11','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000005','Karen','Prado','karen.prado@email.com','+5551999005003','+5551999005003','BR5000003','Prado Clínica',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','12','Suite','Casal'),
('22222222-0000-0000-0000-000000000005','Leonardo','Quevedo','leonardo.quevedo@email.com','+5551999005004','+5551999005004','BR5000004','Quevedo Vinhos',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','10','Balcony','Solteiro'),
('22222222-0000-0000-0000-000000000005','Melissa','Roriz','melissa.roriz@email.com','+5551999005005','+5551999005005','BR5000005','Roriz Assessoria',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','11','Interior','Casal'),
('22222222-0000-0000-0000-000000000005','Nelson','Simoes','nelson.simoes@email.com','+5551999005006','+5551999005006','BR5000006','Simões Carpintaria',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','12','Balcony','Casal'),
('22222222-0000-0000-0000-000000000005','Olga','Torres','olga.torres@email.com','+5551999005007','+5551999005007','BR5000007','Torres Química',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','10','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000005','Pedro','Urquiza','pedro.urquiza@email.com','+5551999005008','+5551999005008','BR5000008','Urquiza Turismo',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','11','Suite','Casal'),
('22222222-0000-0000-0000-000000000005','Queila','Valdez','queila.valdez@email.com','+5551999005009','+5551999005009','BR5000009','Valdez Educação',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','12','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000005','Roberto','Xavier','roberto.xavier@email.com','+5551999005010','+5551999005010','BR5000010','Xavier Agrícola',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','10','Balcony','Casal'),
('22222222-0000-0000-0000-000000000005','Sabrina','Yunes','sabrina.yunes@email.com','+5551999005011','+5551999005011','BR5000011','Yunes Nutrição',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','11','Balcony','Solteiro'),
('22222222-0000-0000-0000-000000000005','Tarcisio','Zanin','tarcisio.zanin@email.com','+5551999005012','+5551999005012','BR5000012','Zanin Investimentos',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','12','Suite','Casal'),
('22222222-0000-0000-0000-000000000005','Ursula','Abreu','ursula.abreu@email.com','+5551999005013','+5551999005013','BR5000013','Abreu Papelaria',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','10','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000005','Valter','Bezerra','valter.bezerra@email.com','+5551999005014','+5551999005014','BR5000014','Bezerra Gás',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','11','Balcony','Casal'),
('22222222-0000-0000-0000-000000000005','Wanda','Calado','wanda.calado@email.com','+5551999005015','+5551999005015','BR5000015','Calado Reciclagem',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','12','Interior','Solteiro'),
('22222222-0000-0000-0000-000000000005','Xico','Dantas','xico.dantas@email.com','+5551999005016','+5551999005016','BR5000016','Dantas Solar',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','10','Suite','Casal'),
('22222222-0000-0000-0000-000000000005','Yolanda','Elias','yolanda.elias@email.com','+5551999005017','+5551999005017','BR5000017','Elias Couro',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','11','Interior','Casal'),
('22222222-0000-0000-0000-000000000005','Zaccarias','Fontes','zaccarias.fontes@email.com','+5551999005018','+5551999005018','BR5000018','Fontes Peixes',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','12','Balcony','Solteiro'),
('22222222-0000-0000-0000-000000000005','Adriana','Gomez','adriana.gomez@email.com','+5551999005019','+5551999005019','BR5000019','Gomez Têxtil',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','10','Interior','Casal'),
('22222222-0000-0000-0000-000000000005','Belmiro','Honorato','belmiro.honorato@email.com','+5551999005020','+5551999005020','BR5000020','Honorato Piscinas',NULL,NULL,NULL,'2026-10-01','2026-10-10','Azul','VCP','2026-10-01','08:00','Azul','VCP','2026-10-10','19:00','Royal Caribbean','11','Suite','Casal');

-- 5. Tickets de exemplo
INSERT INTO public.tickets (passenger_id, group_id, guide_id, category, status, description, passenger_whatsapp, resolved_at, resolution_notes)
SELECT id, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001',
  'hotel', 'resolved', 'Quarto com ar-condicionado com defeito, não resfria adequadamente.',
  whatsapp, NOW() - INTERVAL '2 days', 'Técnico foi ao quarto e consertou o ar-condicionado.'
FROM public.passengers WHERE passport_number = 'BR1000003';

INSERT INTO public.tickets (passenger_id, group_id, guide_id, category, status, description, passenger_whatsapp)
SELECT id, '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001',
  'flight', 'open', 'Bagagem despachada não chegou no aeroporto de destino. Registrei BOC na companhia aérea.',
  whatsapp
FROM public.passengers WHERE passport_number = 'BR1000007';

INSERT INTO public.tickets (passenger_id, group_id, guide_id, category, status, description, passenger_whatsapp)
SELECT id, '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002',
  'ship', 'in_progress', 'Cabine com cheiro forte de esgoto. Reclamei à recepção do navio mas não resolveram.',
  whatsapp
FROM public.passengers WHERE passport_number = 'BR2000003';

INSERT INTO public.tickets (passenger_id, group_id, guide_id, category, status, description, passenger_whatsapp, resolved_at, resolution_notes)
SELECT id, '22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002',
  'transfer', 'resolved', 'Van do translado não apareceu no horário combinado. Aguardei 1 hora.',
  whatsapp, NOW() - INTERVAL '1 day', 'Passeio remarcado e van foi buscá-la pessoalmente.'
FROM public.passengers WHERE passport_number = 'BR2000008';

INSERT INTO public.tickets (passenger_id, group_id, guide_id, category, status, description, passenger_whatsapp)
SELECT id, '22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003',
  'hotel', 'open', 'Hotel diferente do contratado. Estão me alojando em outro hotel sem consultar.',
  whatsapp
FROM public.passengers WHERE passport_number = 'BR3000005';

INSERT INTO public.tickets (passenger_id, group_id, guide_id, category, status, description, passenger_whatsapp)
SELECT id, '22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004',
  'flight', 'open', 'Voo com 4 horas de atraso. Nenhuma informação da companhia aérea.',
  whatsapp
FROM public.passengers WHERE passport_number = 'BR4000002';

INSERT INTO public.tickets (passenger_id, group_id, guide_id, category, status, description, passenger_whatsapp, resolved_at, resolution_notes)
SELECT id, '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000005',
  'ship', 'resolved', 'Cobranças indevidas no cartão do cruzeiro. Total de USD 180.',
  whatsapp, NOW() - INTERVAL '3 days', 'Valores estornados pelo setor financeiro do navio após contestação.'
FROM public.passengers WHERE passport_number = 'BR5000003';

INSERT INTO public.tickets (passenger_id, group_id, guide_id, category, status, description, passenger_whatsapp)
SELECT id, '22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000005',
  'other', 'open', 'Passeio opcional cancelado sem aviso e sem reembolso até agora.',
  whatsapp
FROM public.passengers WHERE passport_number = 'BR5000010';

-- 6. Mensagens nos tickets
INSERT INTO public.ticket_messages (ticket_id, sender, content)
SELECT t.id, 'passenger', 'O ar-condicionado do meu quarto não está funcionando. Está muito quente!'
FROM public.tickets t
JOIN public.passengers p ON t.passenger_id = p.id
WHERE p.passport_number = 'BR1000003' LIMIT 1;

INSERT INTO public.ticket_messages (ticket_id, sender, content)
SELECT t.id, 'agent_ai', 'Olá! Entendido, registrei seu problema com o ar-condicionado. Seu guia Carlos foi notificado e entrará em contato em breve.'
FROM public.tickets t
JOIN public.passengers p ON t.passenger_id = p.id
WHERE p.passport_number = 'BR1000003' LIMIT 1;

INSERT INTO public.ticket_messages (ticket_id, sender, content)
SELECT t.id, 'guide', 'Paulo, já entrei em contato com a recepção. Técnico está a caminho.'
FROM public.tickets t
JOIN public.passengers p ON t.passenger_id = p.id
WHERE p.passport_number = 'BR1000003' LIMIT 1;

-- 7. Promover seu usuário a admin
UPDATE public.users SET role = 'admin' WHERE email = 'thmouco@gmail.com';
