from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import Flowable

# ── Cores ──────────────────────────────────────────────────────────────────
NAVY   = colors.HexColor('#00204a')
GOLD   = colors.HexColor('#fcb900')
LIGHT  = colors.HexColor('#f8f9fa')
GRAY   = colors.HexColor('#6b7280')
GREEN  = colors.HexColor('#10b981')
RED    = colors.HexColor('#ef4444')
BLUE   = colors.HexColor('#3b82f6')
PURPLE = colors.HexColor('#8b5cf6')
WHITE  = colors.white

# ── Estilos ────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def s(name, **kw):
    base = styles[name] if name in styles else styles['Normal']
    return ParagraphStyle(name + '_custom_' + str(id(kw)), parent=base, **kw)

TITLE_STYLE   = s('Title',  fontSize=28, textColor=NAVY,  spaceAfter=6, leading=34, alignment=TA_CENTER)
SUBTITLE_STYLE= s('Normal', fontSize=13, textColor=GOLD,  spaceAfter=4, leading=18, alignment=TA_CENTER)
H1_STYLE      = s('Heading1', fontSize=16, textColor=WHITE, spaceAfter=4, spaceBefore=14, leading=20)
H2_STYLE      = s('Heading2', fontSize=12, textColor=NAVY,  spaceAfter=4, spaceBefore=10, leading=16, fontName='Helvetica-Bold')
H3_STYLE      = s('Heading3', fontSize=10, textColor=NAVY,  spaceAfter=3, spaceBefore=6,  leading=14, fontName='Helvetica-Bold')
BODY_STYLE    = s('Normal',   fontSize=9,  textColor=colors.HexColor('#374151'), spaceAfter=4, leading=14, alignment=TA_JUSTIFY)
SMALL_STYLE   = s('Normal',   fontSize=8,  textColor=GRAY,  spaceAfter=2, leading=12)
BULLET_STYLE  = s('Normal',   fontSize=9,  textColor=colors.HexColor('#374151'), spaceAfter=3, leading=14, leftIndent=14, bulletIndent=4)
CAPTION_STYLE = s('Normal',   fontSize=8,  textColor=GRAY,  alignment=TA_CENTER, spaceAfter=6)

def p(text, style=None):
    return Paragraph(text, style or BODY_STYLE)

def h1(text):
    inner = Paragraph(text, H1_STYLE)
    t = Table([[inner]], colWidths=[17*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('ROUNDEDCORNERS', [4,4,4,4]),
    ]))
    return t

def h2(text): return Paragraph(text, H2_STYLE)
def h3(text): return Paragraph(text, H3_STYLE)
def sp(n=6): return Spacer(1, n)
def hr(): return HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#e5e7eb'), spaceAfter=6, spaceBefore=6)

def bullet(items, color=NAVY):
    rows = []
    for item in items:
        rows.append([
            Paragraph('<font color="#fcb900">&#x2022;</font>', s('Normal', fontSize=10, leading=14)),
            Paragraph(item, BULLET_STYLE)
        ])
    t = Table(rows, colWidths=[0.4*cm, 16.6*cm])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    return t

def role_badge(text, bg):
    inner = Paragraph(f'<font color="white"><b>{text}</b></font>',
                      s('Normal', fontSize=8, alignment=TA_CENTER, leading=12))
    t = Table([[inner]], colWidths=[3*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    return t

def info_box(title, content, bg=LIGHT, border=NAVY):
    title_p = Paragraph(f'<b>{title}</b>', s('Normal', fontSize=9, textColor=border, leading=13))
    body_p  = Paragraph(content, s('Normal', fontSize=9, textColor=colors.HexColor('#374151'), leading=13))
    t = Table([[title_p], [body_p]], colWidths=[17*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (0,0), 8),
        ('BOTTOMPADDING', (0,1), (0,1), 8),
        ('TOPPADDING', (0,1), (0,1), 4),
        ('BOX', (0,0), (-1,-1), 1, border),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
    ]))
    return t

def module_card(icon, title, roles, description, features):
    role_map = {'Admin': NAVY, 'Colaborador': BLUE, 'Guia': GREEN}
    badge_row = []
    for r in roles:
        badge_row.append(role_badge(r, role_map.get(r, GRAY)))
        badge_row.append(Spacer(4, 1))

    header = Table([[
        Paragraph(f'{icon}  <b><font color="#00204a">{title}</font></b>',
                  s('Normal', fontSize=12, leading=16)),
        ''
    ]], colWidths=[12*cm, 5*cm])

    feat_items = ''.join([f'<bullet>&bull;</bullet>{f}<br/>' for f in features])
    feat_p = Paragraph(feat_items, s('Normal', fontSize=8.5, textColor=colors.HexColor('#374151'), leading=13, leftIndent=10))

    roles_str = '  '.join([f'<font color="{["#00204a","#3b82f6","#10b981"][["Admin","Colaborador","Guia"].index(r)] if r in ["Admin","Colaborador","Guia"] else "#6b7280"}"><b>[{r}]</b></font>' for r in roles])

    inner = [
        Paragraph(f'{icon}  <b><font color="#00204a" size="11">{title}</font></b>   <font size="8" color="#6b7280">{roles_str}</font>',
                  s('Normal', fontSize=11, leading=16)),
        sp(4),
        Paragraph(description, s('Normal', fontSize=9, textColor=colors.HexColor('#4b5563'), leading=13)),
        sp(4),
        feat_p,
    ]
    t = Table([[inner]], colWidths=[17*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    return t

# ── Documento ──────────────────────────────────────────────────────────────
OUTPUT = '/Users/thmouco/Documents/Claude/koglin-system/Koglin_Viagens_Sistema.pdf'
doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm,
    title='Koglin Viagens – Documentação do Sistema',
    author='Koglin Viagens',
)

story = []

# ══════════════════════════════════════════════════════════════════════════
# CAPA
# ══════════════════════════════════════════════════════════════════════════
story.append(sp(40))
# Barra dourada
bar = Table([['  ']], colWidths=[17*cm])
bar.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), GOLD), ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4)]))
story.append(bar)
story.append(sp(20))
story.append(Paragraph('Koglin Viagens', TITLE_STYLE))
story.append(sp(6))
story.append(Paragraph('Sistema de Gestão de Grupos', SUBTITLE_STYLE))
story.append(sp(4))
story.append(Paragraph('Documentação Completa do Sistema', s('Normal', fontSize=10, textColor=GRAY, alignment=TA_CENTER)))
story.append(sp(20))
story.append(bar)
story.append(sp(30))

# Resumo capa
capa_data = [
    [Paragraph('<b>Plataforma</b>', s('Normal', fontSize=9, textColor=GRAY, alignment=TA_CENTER)),
     Paragraph('<b>Versão</b>', s('Normal', fontSize=9, textColor=GRAY, alignment=TA_CENTER)),
     Paragraph('<b>Data</b>', s('Normal', fontSize=9, textColor=GRAY, alignment=TA_CENTER))],
    [Paragraph('Next.js 14 + Supabase', s('Normal', fontSize=10, textColor=NAVY, alignment=TA_CENTER, fontName='Helvetica-Bold')),
     Paragraph('1.0', s('Normal', fontSize=10, textColor=NAVY, alignment=TA_CENTER, fontName='Helvetica-Bold')),
     Paragraph('Junho 2026', s('Normal', fontSize=10, textColor=NAVY, alignment=TA_CENTER, fontName='Helvetica-Bold'))],
]
capa_t = Table(capa_data, colWidths=[5.67*cm, 5.67*cm, 5.66*cm])
capa_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), LIGHT),
    ('BACKGROUND', (0,1), (-1,1), colors.white),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
]))
story.append(capa_t)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════
# ÍNDICE
# ══════════════════════════════════════════════════════════════════════════
story.append(h1('Índice'))
story.append(sp(8))
sections = [
    ('1.', 'Visão Geral do Sistema'),
    ('2.', 'Perfis de Acesso'),
    ('3.', 'Estrutura do Menu'),
    ('4.', 'Módulos do Sistema'),
    ('  4.1', 'Dashboard'),
    ('  4.2', 'Clientes'),
    ('  4.3', 'Grupos'),
    ('  4.4', 'Passageiros'),
    ('  4.5', 'Tickets de Suporte'),
    ('  4.6', 'Base de Conhecimento'),
    ('  4.7', 'Tabelas de Referência'),
    ('  4.8', 'Usuários'),
    ('5.', 'Fluxos Principais'),
    ('6.', 'Tecnologias Utilizadas'),
    ('7.', 'Instalação e Configuração'),
]
idx_data = [[
    Paragraph(num, s('Normal', fontSize=9, textColor=GRAY)),
    Paragraph(name, s('Normal', fontSize=9, textColor=NAVY)),
] for num, name in sections]
idx_t = Table(idx_data, colWidths=[1.5*cm, 15.5*cm])
idx_t.setStyle(TableStyle([
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LINEBELOW', (0,0), (-1,-2), 0.3, colors.HexColor('#f3f4f6')),
]))
story.append(idx_t)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════
# 1. VISÃO GERAL
# ══════════════════════════════════════════════════════════════════════════
story.append(h1('1. Visão Geral do Sistema'))
story.append(sp(10))
story.append(p(
    'O <b>Koglin Viagens</b> é uma plataforma web de gestão de grupos de viagem corporativa. '
    'O sistema centraliza todas as informações de passageiros, grupos, clientes e projetos, '
    'além de oferecer um canal de suporte via tickets integrado a um agente de IA chamado <b>Kogi</b>.'
))
story.append(sp(4))
story.append(p(
    'A plataforma foi desenvolvida para atender operadoras de turismo corporativo que gerenciam '
    'viagens de incentivo para empresas clientes. Cada projeto pertence a um cliente específico '
    'e pode ter múltiplos grupos de viajantes, cada grupo com seus passageiros e guias responsáveis.'
))
story.append(sp(8))

story.append(info_box(
    'Conceito Central',
    'Cliente → Projeto → Grupo → Passageiros / Tickets. '
    'Exemplo: Cliente "Ipiranga" tem o projeto "Clube do Milhao" com grupos de viagem para '
    'diferentes destinos. Cada grupo tem passageiros cadastrados e um guia responsavel.',
    bg=colors.HexColor('#eff6ff'), border=BLUE
))
story.append(sp(10))

story.append(h2('Principais Objetivos'))
story.append(bullet([
    '<b>Centralizar dados</b> de passageiros, voos, hoteis e cruzeiros em um unico lugar',
    '<b>Gerenciar clientes e projetos</b> com controle financeiro e de prazos',
    '<b>Suporte rapido</b> via tickets com triagem automatica pelo agente Kogi',
    '<b>Controle de acesso</b> por perfil: administradores, colaboradores e guias',
    '<b>Base de conhecimento</b> consultavel pelo agente de IA e pelos guias',
]))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════
# 2. PERFIS DE ACESSO
# ══════════════════════════════════════════════════════════════════════════
story.append(h1('2. Perfis de Acesso'))
story.append(sp(10))
story.append(p('O sistema possui tres niveis de acesso, cada um com permissoes especificas:'))
story.append(sp(8))

roles_data = [
    [
        Paragraph('<b>Perfil</b>', s('Normal', fontSize=9, textColor=WHITE)),
        Paragraph('<b>Descricao</b>', s('Normal', fontSize=9, textColor=WHITE)),
        Paragraph('<b>Permissoes Principais</b>', s('Normal', fontSize=9, textColor=WHITE)),
    ],
    [
        Paragraph('<b>Administrador</b>', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')),
        Paragraph('Acesso total ao sistema. Gerencia usuarios, configuracoes e todos os dados.', SMALL_STYLE),
        Paragraph('Tudo + Usuarios + Configuracoes', SMALL_STYLE),
    ],
    [
        Paragraph('<b>Colaborador</b>', s('Normal', fontSize=9, textColor=BLUE, fontName='Helvetica-Bold')),
        Paragraph('Acesso operacional. Gerencia clientes, projetos, grupos e passageiros.', SMALL_STYLE),
        Paragraph('Dashboard, Clientes, Grupos, Passageiros, Tickets, Base de Conhecimento', SMALL_STYLE),
    ],
    [
        Paragraph('<b>Guia</b>', s('Normal', fontSize=9, textColor=GREEN, fontName='Helvetica-Bold')),
        Paragraph('Acesso limitado. Ve passageiros e tickets do sistema. Consulta a base de conhecimento.', SMALL_STYLE),
        Paragraph('Passageiros, Tickets, Base de Conhecimento', SMALL_STYLE),
    ],
]
roles_t = Table(roles_data, colWidths=[3.5*cm, 7*cm, 6.5*cm])
roles_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#f0f4ff')),
    ('BACKGROUND', (0,2), (-1,2), colors.HexColor('#f0f8ff')),
    ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#f0fff8')),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
]))
story.append(roles_t)
story.append(sp(10))

story.append(info_box(
    'Como cadastrar um usuario',
    'Acesse Configuracoes > Usuarios > Convidar Usuario. Preencha nome, e-mail, perfil e opcionalmente '
    'telefone e WhatsApp. O sistema envia um convite por e-mail. O usuario define a propria senha ao aceitar o convite.',
    bg=colors.HexColor('#fff7ed'), border=GOLD
))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════
# 3. ESTRUTURA DO MENU
# ══════════════════════════════════════════════════════════════════════════
story.append(h1('3. Estrutura do Menu'))
story.append(sp(10))
story.append(p('O menu lateral e dividido em duas secoes com visibilidade por perfil:'))
story.append(sp(8))

menu_data = [
    [
        Paragraph('<b>Secao</b>', s('Normal', fontSize=9, textColor=WHITE)),
        Paragraph('<b>Item</b>', s('Normal', fontSize=9, textColor=WHITE)),
        Paragraph('<b>Admin</b>', s('Normal', fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
        Paragraph('<b>Colaborador</b>', s('Normal', fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
        Paragraph('<b>Guia</b>', s('Normal', fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
    ],
]
menu_items = [
    ('Principal', 'Dashboard', True, True, False),
    ('Principal', 'Clientes', True, True, False),
    ('Principal', 'Grupos', True, True, False),
    ('Principal', 'Passageiros', True, True, True),
    ('Principal', 'Tickets', True, True, True),
    ('Principal', 'Base de Conhecimento', True, True, True),
    ('Configuracoes', 'Usuarios', True, False, False),
    ('Configuracoes', 'Tabelas de Referencia', True, False, False),
    ('Configuracoes', 'Integracoes', True, False, False),
]

def check(v):
    return Paragraph('<font color="#10b981"><b>Sim</b></font>' if v else '<font color="#9ca3af">—</font>',
                     s('Normal', fontSize=9, alignment=TA_CENTER))

for i, (sec, item, adm, col, gui) in enumerate(menu_items):
    row = [
        Paragraph(sec, SMALL_STYLE),
        Paragraph(item, s('Normal', fontSize=9, textColor=NAVY)),
        check(adm), check(col), check(gui),
    ]
    menu_data.append(row)

menu_t = Table(menu_data, colWidths=[4*cm, 6.5*cm, 2.2*cm, 2.4*cm, 1.9*cm])
menu_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f9fafb')]),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
    ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(menu_t)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════
# 4. MÓDULOS
# ══════════════════════════════════════════════════════════════════════════
story.append(h1('4. Modulos do Sistema'))
story.append(sp(10))

# 4.1 Dashboard
story.append(h2('4.1  Dashboard'))
story.append(p(
    'Painel principal com indicadores de desempenho em tempo real. '
    'Oferece uma visao consolidada da operacao atual.'
))
story.append(sp(6))
kpi_data = [
    [Paragraph('<b>KPI</b>', s('Normal', fontSize=9, textColor=WHITE)),
     Paragraph('<b>Descricao</b>', s('Normal', fontSize=9, textColor=WHITE))],
    [Paragraph('Total de Passageiros', SMALL_STYLE), Paragraph('Numero total de passageiros cadastrados no sistema', SMALL_STYLE)],
    [Paragraph('Grupos Ativos', SMALL_STYLE), Paragraph('Quantidade de grupos em operacao', SMALL_STYLE)],
    [Paragraph('Tickets Abertos', SMALL_STYLE), Paragraph('Tickets aguardando atendimento', SMALL_STYLE)],
    [Paragraph('Tempo Medio de Resolucao', SMALL_STYLE), Paragraph('Media de horas para resolver um ticket', SMALL_STYLE)],
    [Paragraph('Grafico por Grupo', SMALL_STYLE), Paragraph('Barras horizontais com volume de tickets por grupo', SMALL_STYLE)],
    [Paragraph('Grafico por Guia', SMALL_STYLE), Paragraph('Tempo medio de atendimento por guia responsavel', SMALL_STYLE)],
]
kpi_t = Table(kpi_data, colWidths=[5*cm, 12*cm])
kpi_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
    ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(kpi_t)
story.append(sp(12))

# 4.2 Clientes
story.append(h2('4.2  Clientes'))
story.append(p(
    'Modulo de gestao de carteira de clientes. Cada cliente pode ter varios projetos e multiplos contatos.'
))
story.append(sp(6))
story.append(bullet([
    '<b>Listagem:</b> cards com logotipo, nome, numero de projetos e valor total da carteira',
    '<b>Graficos:</b> "Projetos por Cliente" e "Carteira de Projetos por Cliente" com barras comparativas',
    '<b>Cadastro:</b> nome do cliente e upload de logotipo',
    '<b>Detalhe do cliente:</b> lista de projetos (com valor, datas e descricao) e contatos da empresa',
    '<b>Projetos:</b> nome, data de inicio/fim, valor em reais e descricao',
    '<b>Contatos:</b> nome, cargo, e-mail, telefone e WhatsApp com botao de atalho',
]))
story.append(sp(12))

# 4.3 Grupos
story.append(h2('4.3  Grupos'))
story.append(p(
    'Gestao dos grupos de viagem. Um grupo reune passageiros e esta associado a um guia responsavel.'
))
story.append(sp(6))
story.append(bullet([
    'Cadastro de grupos com nome, descricao e vinculo a um guia',
    'Contador de passageiros por grupo',
    'Associacao com projetos (via project_id)',
    'Visivel para administradores e colaboradores',
]))
story.append(sp(12))

# 4.4 Passageiros
story.append(h2('4.4  Passageiros'))
story.append(p(
    'Cadastro completo dos viajantes. O formulario e organizado em 5 abas para facilitar o preenchimento. '
    'Suporta importacao em massa via CSV.'
))
story.append(sp(6))

pass_data = [
    [Paragraph('<b>Aba</b>', s('Normal', fontSize=9, textColor=WHITE)),
     Paragraph('<b>Campos</b>', s('Normal', fontSize=9, textColor=WHITE))],
    [Paragraph('Pessoal', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')),
     Paragraph('Nome, sobrenome, data de nascimento, numero de passaporte, empresa, grupo', SMALL_STYLE)],
    [Paragraph('Contato', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')),
     Paragraph('E-mail, telefone (com codigo internacional), WhatsApp (com codigo internacional)', SMALL_STYLE)],
    [Paragraph('Voos', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')),
     Paragraph('Companhia aerea de ida/volta, aeroporto de origem/destino (autocomplete IATA), data e horario', SMALL_STYLE)],
    [Paragraph('Hotel', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')),
     Paragraph('Nome do hotel, categoria do quarto, tipo de cama, datas de check-in e check-out', SMALL_STYLE)],
    [Paragraph('Navio', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')),
     Paragraph('Companhia de cruzeiro, deck, categoria da cabine, tipo da cabine', SMALL_STYLE)],
]
pass_t = Table(pass_data, colWidths=[3.5*cm, 13.5*cm])
pass_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
    ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
]))
story.append(pass_t)
story.append(sp(6))
story.append(info_box(
    'Importacao CSV',
    'O botao "Importar CSV" permite subir uma planilha com multiplos passageiros de uma vez. '
    'Use o botao "Baixar Modelo" para obter o arquivo CSV ja formatado com todas as colunas necessarias.',
    bg=colors.HexColor('#f0fff8'), border=GREEN
))
story.append(PageBreak())

# 4.5 Tickets
story.append(h2('4.5  Tickets de Suporte'))
story.append(p(
    'Sistema de atendimento a passageiros. Os tickets podem ser criados pelo proprio passageiro via WhatsApp '
    '(triados pelo agente Kogi) ou manualmente pela equipe.'
))
story.append(sp(6))

status_data = [
    [Paragraph('<b>Status</b>', s('Normal', fontSize=9, textColor=WHITE)),
     Paragraph('<b>Significado</b>', s('Normal', fontSize=9, textColor=WHITE)),
     Paragraph('<b>Proxima acao</b>', s('Normal', fontSize=9, textColor=WHITE))],
    [Paragraph('<font color="#ef4444"><b>Aberto</b></font>', s('Normal', fontSize=9)),
     Paragraph('Ticket criado, aguardando atendimento', SMALL_STYLE),
     Paragraph('Marcar como Em Andamento', SMALL_STYLE)],
    [Paragraph('<font color="#f59e0b"><b>Em Andamento</b></font>', s('Normal', fontSize=9)),
     Paragraph('Atendente ja esta tratando o caso', SMALL_STYLE),
     Paragraph('Adicionar nota de resolucao e fechar', SMALL_STYLE)],
    [Paragraph('<font color="#10b981"><b>Resolvido</b></font>', s('Normal', fontSize=9)),
     Paragraph('Problema solucionado com nota registrada', SMALL_STYLE),
     Paragraph('Nenhuma — ticket arquivado', SMALL_STYLE)],
    [Paragraph('<font color="#6b7280"><b>Fechado</b></font>', s('Normal', fontSize=9)),
     Paragraph('Encerrado sem necessidade de resolucao', SMALL_STYLE),
     Paragraph('Nenhuma', SMALL_STYLE)],
]
status_t = Table(status_data, colWidths=[3.5*cm, 7.5*cm, 6*cm])
status_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
    ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(status_t)
story.append(sp(8))
story.append(bullet([
    'Filtros por status e categoria de ticket',
    'Busca por nome do passageiro, descricao ou ID',
    'Visualizacao do historico completo de mensagens (passageiro, Kogi, guia, sistema)',
    'Botao de WhatsApp direto para o passageiro',
    'Categorias com cores personalizaveis em Tabelas de Referencia',
]))
story.append(sp(12))

# 4.6 Base de Conhecimento
story.append(h2('4.6  Base de Conhecimento'))
story.append(p(
    'Repositorio de artigos utilizado pelo agente de IA Kogi para responder automaticamente '
    'as duvidas dos passageiros. Tambem consultavel pelos guias.'
))
story.append(sp(6))
story.append(bullet([
    'Criacao de artigos com titulo, categoria e conteudo',
    'Categorias gerenciadas dinamicamente em Tabelas de Referencia',
    'Ativar/desativar artigos sem excluir (controle de uso pelo Kogi)',
    'Filtro por categoria para navegacao rapida',
    'Visivelidade: Administradores, Colaboradores e Guias',
]))
story.append(sp(12))

# 4.7 Tabelas de Referência
story.append(h2('4.7  Tabelas de Referencia'))
story.append(p(
    'Painel centralizado para gerenciar todos os dados de referencia usados nos formularios do sistema. '
    'Qualquer alteracao aqui reflete imediatamente em todo o sistema.'
))
story.append(sp(6))

ref_data = [
    [Paragraph('<b>Aba</b>', s('Normal', fontSize=9, textColor=WHITE)),
     Paragraph('<b>O que gerencia</b>', s('Normal', fontSize=9, textColor=WHITE)),
     Paragraph('<b>Usado em</b>', s('Normal', fontSize=9, textColor=WHITE))],
    [Paragraph('Companhias Aereas', SMALL_STYLE), Paragraph('Nome e codigo IATA das companhias', SMALL_STYLE), Paragraph('Formulario de voos do passageiro', SMALL_STYLE)],
    [Paragraph('Companhias de Cruzeiro', SMALL_STYLE), Paragraph('Nomes das operadoras de navio', SMALL_STYLE), Paragraph('Formulario de navio do passageiro', SMALL_STYLE)],
    [Paragraph('Tipos de Cama', SMALL_STYLE), Paragraph('Casal, Solteiro, Twin, King, etc.', SMALL_STYLE), Paragraph('Formulario de hotel do passageiro', SMALL_STYLE)],
    [Paragraph('Categorias de Ticket', SMALL_STYLE), Paragraph('Nome + cor do label (ex: Hotel, Voo, Emergencia)', SMALL_STYLE), Paragraph('Criacao e visualizacao de tickets', SMALL_STYLE)],
    [Paragraph('Categorias de Artigo', SMALL_STYLE), Paragraph('Categorias da base de conhecimento', SMALL_STYLE), Paragraph('Artigos e filtro na base de conhecimento', SMALL_STYLE)],
]
ref_t = Table(ref_data, colWidths=[4*cm, 7*cm, 6*cm])
ref_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
    ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(ref_t)
story.append(sp(12))

# 4.8 Usuários
story.append(h2('4.8  Usuarios'))
story.append(p('Gerenciamento de membros da equipe. Exclusivo para Administradores.'))
story.append(sp(6))
story.append(bullet([
    'Convite por e-mail com definicao de perfil (Admin, Colaborador ou Guia)',
    'Visualizacao de todos os usuarios cadastrados com status ativo/inativo',
    'Edicao de nome, perfil, telefone e WhatsApp',
    'Botao de WhatsApp para contato rapido com o membro da equipe',
]))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════
# 5. FLUXOS PRINCIPAIS
# ══════════════════════════════════════════════════════════════════════════
story.append(h1('5. Fluxos Principais'))
story.append(sp(10))

flows = [
    ('Onboarding de novo projeto', [
        '1. Cadastrar o cliente em Clientes > Novo Cliente (logo + nome)',
        '2. Dentro do cliente, criar o projeto (nome, valor, datas, descricao)',
        '3. Criar o grupo em Grupos e vincular ao projeto',
        '4. Convidar guias em Usuarios e atribuir ao grupo',
        '5. Cadastrar passageiros individualmente ou via importacao CSV',
    ]),
    ('Atendimento de ticket', [
        '1. Ticket chega via WhatsApp do passageiro (triado pelo Kogi) ou criado manualmente',
        '2. Equipe ve o ticket na listagem com status "Aberto" e a categoria colorida',
        '3. Clicar no ticket abre o historico de mensagens e info do passageiro',
        '4. Marcar como "Em Andamento" enquanto trata o caso',
        '5. Adicionar nota de resolucao e marcar como "Resolvido"',
    ]),
    ('Gestao de dados de referencia', [
        '1. Acesse Configuracoes > Tabelas de Referencia',
        '2. Selecione a aba desejada (ex: Categorias de Ticket)',
        '3. Digite o nome, escolha a cor no seletor ou nos presets',
        '4. Clique em + para adicionar — aparece imediatamente em todo o sistema',
        '5. Para remover, clique no icone de lixeira ao lado do item',
    ]),
]

for title, steps in flows:
    story.append(h3(title))
    story.append(bullet(steps))
    story.append(sp(8))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════
# 6. TECNOLOGIAS
# ══════════════════════════════════════════════════════════════════════════
story.append(h1('6. Tecnologias Utilizadas'))
story.append(sp(10))

tech_data = [
    [Paragraph('<b>Camada</b>', s('Normal', fontSize=9, textColor=WHITE)),
     Paragraph('<b>Tecnologia</b>', s('Normal', fontSize=9, textColor=WHITE)),
     Paragraph('<b>Funcao</b>', s('Normal', fontSize=9, textColor=WHITE))],
    [Paragraph('Frontend', SMALL_STYLE), Paragraph('Next.js 14 (App Router)', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')), Paragraph('Framework React com SSR e rotas de servidor', SMALL_STYLE)],
    [Paragraph('UI', SMALL_STYLE), Paragraph('Tailwind CSS + shadcn/ui', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')), Paragraph('Estilizacao e componentes prontos', SMALL_STYLE)],
    [Paragraph('Backend', SMALL_STYLE), Paragraph('Supabase', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')), Paragraph('Banco PostgreSQL, autenticacao, storage e RLS', SMALL_STYLE)],
    [Paragraph('Graficos', SMALL_STYLE), Paragraph('Recharts', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')), Paragraph('Graficos de barras e areas no dashboard', SMALL_STYLE)],
    [Paragraph('Linguagem', SMALL_STYLE), Paragraph('TypeScript', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')), Paragraph('Tipagem estatica em todo o projeto', SMALL_STYLE)],
    [Paragraph('Hospedagem', SMALL_STYLE), Paragraph('Vercel (recomendado)', s('Normal', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold')), Paragraph('Deploy automatico integrado ao Next.js', SMALL_STYLE)],
]
tech_t = Table(tech_data, colWidths=[3*cm, 5*cm, 9*cm])
tech_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
    ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(tech_t)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════
# 7. INSTALAÇÃO
# ══════════════════════════════════════════════════════════════════════════
story.append(h1('7. Instalacao e Configuracao'))
story.append(sp(10))

story.append(h2('Requisitos'))
story.append(bullet([
    'Node.js versao 18 ou superior',
    'npm ou yarn (gerenciador de pacotes)',
    'Projeto no Supabase com as migrations executadas',
    'Arquivo .env.local com as chaves do Supabase',
]))
story.append(sp(8))

story.append(h2('Passos para instalar'))
steps_install = [
    ('1', 'Copiar a pasta do projeto', 'Copie a pasta koglin-system para o computador de destino (via pen drive, zip ou Git)'),
    ('2', 'Instalar dependencias', 'Abra o terminal na pasta do projeto e execute: npm install'),
    ('3', 'Configurar variaveis de ambiente', 'Copie o arquivo .env.local do computador original (contem as chaves SUPABASE_URL e SUPABASE_ANON_KEY)'),
    ('4', 'Iniciar o servidor', 'Execute: npm run dev — o sistema estara disponivel em http://localhost:3000'),
    ('5', 'Acessar o sistema', 'Abra o navegador em localhost:3000 e faca login com seu e-mail e senha'),
]
for num, step, desc in steps_install:
    row_data = [
        [
            Paragraph(f'<font color="white"><b>{num}</b></font>',
                      s('Normal', fontSize=10, alignment=TA_CENTER, leading=14)),
            Paragraph(f'<b>{step}</b><br/><font color="#6b7280" size="8">{desc}</font>',
                      s('Normal', fontSize=9, leading=14)),
        ]
    ]
    row_t = Table(row_data, colWidths=[1*cm, 16*cm])
    row_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), NAVY),
        ('BACKGROUND', (1,0), (1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e5e7eb')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (0,0), 4),
        ('LEFTPADDING', (1,0), (1,0), 12),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(row_t)
    story.append(sp(3))

story.append(sp(8))
story.append(info_box(
    'Arquivo .env.local — IMPORTANTE',
    'Este arquivo contem as credenciais de acesso ao banco de dados e NAO deve ser compartilhado '
    'publicamente. Guarde-o em local seguro e copie-o manualmente para cada computador onde o '
    'sistema for instalado. Sem ele o sistema nao consegue conectar ao Supabase.',
    bg=colors.HexColor('#fff1f2'), border=RED
))

# Rodape
story.append(sp(20))
bar2 = Table([['  ']], colWidths=[17*cm])
bar2.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), GOLD), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
story.append(bar2)
story.append(sp(6))
story.append(Paragraph('Koglin Viagens — Documentacao interna. Junho 2026.',
                        s('Normal', fontSize=8, textColor=GRAY, alignment=TA_CENTER)))

# ── Build ──────────────────────────────────────────────────────────────────
doc.build(story)
print(f'PDF gerado: {OUTPUT}')
