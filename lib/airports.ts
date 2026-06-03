export interface Airport {
  iata: string
  name: string
  city: string
  country: string
}

export const AIRPORTS: Airport[] = [
  // Brasil
  { iata: 'GRU', name: 'Aeroporto Internacional de Guarulhos', city: 'São Paulo', country: 'Brasil' },
  { iata: 'CGH', name: 'Aeroporto de Congonhas', city: 'São Paulo', country: 'Brasil' },
  { iata: 'VCP', name: 'Aeroporto de Viracopos', city: 'Campinas', country: 'Brasil' },
  { iata: 'GIG', name: 'Aeroporto Internacional do Galeão', city: 'Rio de Janeiro', country: 'Brasil' },
  { iata: 'SDU', name: 'Aeroporto Santos Dumont', city: 'Rio de Janeiro', country: 'Brasil' },
  { iata: 'BSB', name: 'Aeroporto Internacional de Brasília', city: 'Brasília', country: 'Brasil' },
  { iata: 'SSA', name: 'Aeroporto Internacional de Salvador', city: 'Salvador', country: 'Brasil' },
  { iata: 'FOR', name: 'Aeroporto Internacional de Fortaleza', city: 'Fortaleza', country: 'Brasil' },
  { iata: 'REC', name: 'Aeroporto Internacional de Recife', city: 'Recife', country: 'Brasil' },
  { iata: 'POA', name: 'Aeroporto Internacional de Porto Alegre', city: 'Porto Alegre', country: 'Brasil' },
  { iata: 'CWB', name: 'Aeroporto Internacional de Curitiba', city: 'Curitiba', country: 'Brasil' },
  { iata: 'FLN', name: 'Aeroporto Internacional de Florianópolis', city: 'Florianópolis', country: 'Brasil' },
  { iata: 'BEL', name: 'Aeroporto Internacional de Belém', city: 'Belém', country: 'Brasil' },
  { iata: 'MAO', name: 'Aeroporto Internacional de Manaus', city: 'Manaus', country: 'Brasil' },
  { iata: 'NAT', name: 'Aeroporto Internacional de Natal', city: 'Natal', country: 'Brasil' },
  { iata: 'MCZ', name: 'Aeroporto Internacional de Maceió', city: 'Maceió', country: 'Brasil' },
  { iata: 'AJU', name: 'Aeroporto Internacional de Aracaju', city: 'Aracaju', country: 'Brasil' },
  { iata: 'THE', name: 'Aeroporto Internacional de Teresina', city: 'Teresina', country: 'Brasil' },
  { iata: 'SLZ', name: 'Aeroporto Internacional de São Luís', city: 'São Luís', country: 'Brasil' },
  { iata: 'VIX', name: 'Aeroporto de Vitória', city: 'Vitória', country: 'Brasil' },
  // Europa
  { iata: 'LIS', name: 'Aeroporto Humberto Delgado', city: 'Lisboa', country: 'Portugal' },
  { iata: 'OPO', name: 'Aeroporto Francisco Sá Carneiro', city: 'Porto', country: 'Portugal' },
  { iata: 'MAD', name: 'Aeroporto Adolfo Suárez Madrid-Barajas', city: 'Madri', country: 'Espanha' },
  { iata: 'BCN', name: 'Aeroporto El Prat', city: 'Barcelona', country: 'Espanha' },
  { iata: 'CDG', name: 'Aeroporto Charles de Gaulle', city: 'Paris', country: 'França' },
  { iata: 'ORY', name: 'Aeroporto de Orly', city: 'Paris', country: 'França' },
  { iata: 'LHR', name: 'Aeroporto de Heathrow', city: 'Londres', country: 'Reino Unido' },
  { iata: 'LGW', name: 'Aeroporto de Gatwick', city: 'Londres', country: 'Reino Unido' },
  { iata: 'STN', name: 'Aeroporto de Stansted', city: 'Londres', country: 'Reino Unido' },
  { iata: 'FRA', name: 'Aeroporto de Frankfurt', city: 'Frankfurt', country: 'Alemanha' },
  { iata: 'MUC', name: 'Aeroporto de Munique', city: 'Munique', country: 'Alemanha' },
  { iata: 'TXL', name: 'Aeroporto de Berlim-Tegel', city: 'Berlim', country: 'Alemanha' },
  { iata: 'BER', name: 'Aeroporto de Berlim Brandenburg', city: 'Berlim', country: 'Alemanha' },
  { iata: 'AMS', name: 'Aeroporto de Amsterdã Schiphol', city: 'Amsterdã', country: 'Países Baixos' },
  { iata: 'FCO', name: 'Aeroporto Leonardo da Vinci', city: 'Roma', country: 'Itália' },
  { iata: 'MXP', name: 'Aeroporto de Malpensa', city: 'Milão', country: 'Itália' },
  { iata: 'VCE', name: 'Aeroporto Marco Polo', city: 'Veneza', country: 'Itália' },
  { iata: 'ZRH', name: 'Aeroporto de Zurique', city: 'Zurique', country: 'Suíça' },
  { iata: 'GVA', name: 'Aeroporto de Genebra', city: 'Genebra', country: 'Suíça' },
  { iata: 'VIE', name: 'Aeroporto de Viena', city: 'Viena', country: 'Áustria' },
  { iata: 'BRU', name: 'Aeroporto de Bruxelas', city: 'Bruxelas', country: 'Bélgica' },
  { iata: 'CPH', name: 'Aeroporto de Copenhague', city: 'Copenhague', country: 'Dinamarca' },
  { iata: 'ARN', name: 'Aeroporto de Estocolmo Arlanda', city: 'Estocolmo', country: 'Suécia' },
  { iata: 'OSL', name: 'Aeroporto de Oslo Gardermoen', city: 'Oslo', country: 'Noruega' },
  { iata: 'HEL', name: 'Aeroporto de Helsinque-Vantaa', city: 'Helsinque', country: 'Finlândia' },
  { iata: 'ATH', name: 'Aeroporto Internacional de Atenas', city: 'Atenas', country: 'Grécia' },
  { iata: 'IST', name: 'Aeroporto de Istambul', city: 'Istambul', country: 'Turquia' },
  { iata: 'WAW', name: 'Aeroporto Chopin de Varsóvia', city: 'Varsóvia', country: 'Polônia' },
  { iata: 'PRG', name: 'Aeroporto Václav Havel', city: 'Praga', country: 'Rep. Tcheca' },
  { iata: 'BUD', name: 'Aeroporto de Budapeste', city: 'Budapeste', country: 'Hungria' },
  { iata: 'NCE', name: 'Aeroporto de Nice', city: 'Nice', country: 'França' },
  // Américas
  { iata: 'JFK', name: 'Aeroporto Internacional John F. Kennedy', city: 'Nova York', country: 'EUA' },
  { iata: 'EWR', name: 'Aeroporto Internacional Newark', city: 'Nova York', country: 'EUA' },
  { iata: 'LAX', name: 'Aeroporto Internacional de Los Angeles', city: 'Los Angeles', country: 'EUA' },
  { iata: 'ORD', name: "Aeroporto Internacional O'Hare", city: 'Chicago', country: 'EUA' },
  { iata: 'MIA', name: 'Aeroporto Internacional de Miami', city: 'Miami', country: 'EUA' },
  { iata: 'ATL', name: 'Aeroporto Internacional Hartsfield-Jackson', city: 'Atlanta', country: 'EUA' },
  { iata: 'SFO', name: 'Aeroporto Internacional de São Francisco', city: 'São Francisco', country: 'EUA' },
  { iata: 'DFW', name: 'Aeroporto Internacional Dallas/Fort Worth', city: 'Dallas', country: 'EUA' },
  { iata: 'BOS', name: 'Aeroporto Internacional Logan', city: 'Boston', country: 'EUA' },
  { iata: 'LAS', name: 'Aeroporto Internacional Harry Reid', city: 'Las Vegas', country: 'EUA' },
  { iata: 'MCO', name: 'Aeroporto Internacional de Orlando', city: 'Orlando', country: 'EUA' },
  { iata: 'YYZ', name: 'Aeroporto Internacional Pearson', city: 'Toronto', country: 'Canadá' },
  { iata: 'YVR', name: 'Aeroporto Internacional de Vancouver', city: 'Vancouver', country: 'Canadá' },
  { iata: 'MEX', name: 'Aeroporto Internacional Benito Juárez', city: 'Cidade do México', country: 'México' },
  { iata: 'EZE', name: 'Aeroporto Internacional Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina' },
  { iata: 'AEP', name: 'Aeroporto Jorge Newbery', city: 'Buenos Aires', country: 'Argentina' },
  { iata: 'SCL', name: 'Aeroporto Internacional Arturo Merino Benítez', city: 'Santiago', country: 'Chile' },
  { iata: 'BOG', name: 'Aeroporto Internacional El Dorado', city: 'Bogotá', country: 'Colômbia' },
  { iata: 'LIM', name: 'Aeroporto Internacional Jorge Chávez', city: 'Lima', country: 'Peru' },
  { iata: 'MVD', name: 'Aeroporto Internacional de Montevidéu', city: 'Montevidéu', country: 'Uruguai' },
  { iata: 'ASU', name: 'Aeroporto Internacional Silvio Pettirossi', city: 'Assunção', country: 'Paraguai' },
  // Ásia e Oceania
  { iata: 'NRT', name: 'Aeroporto Internacional de Narita', city: 'Tóquio', country: 'Japão' },
  { iata: 'HND', name: 'Aeroporto Internacional de Haneda', city: 'Tóquio', country: 'Japão' },
  { iata: 'KIX', name: 'Aeroporto Internacional de Kansai', city: 'Osaka', country: 'Japão' },
  { iata: 'ICN', name: 'Aeroporto Internacional de Incheon', city: 'Seul', country: 'Coreia do Sul' },
  { iata: 'PEK', name: 'Aeroporto Internacional de Pequim', city: 'Pequim', country: 'China' },
  { iata: 'PVG', name: 'Aeroporto Internacional de Pudong', city: 'Xangai', country: 'China' },
  { iata: 'HKG', name: 'Aeroporto Internacional de Hong Kong', city: 'Hong Kong', country: 'China' },
  { iata: 'SIN', name: 'Aeroporto Internacional de Changi', city: 'Singapura', country: 'Singapura' },
  { iata: 'BKK', name: 'Aeroporto Internacional Suvarnabhumi', city: 'Bangkok', country: 'Tailândia' },
  { iata: 'DXB', name: 'Aeroporto Internacional de Dubai', city: 'Dubai', country: 'Emirados Árabes' },
  { iata: 'AUH', name: 'Aeroporto Internacional de Abu Dhabi', city: 'Abu Dhabi', country: 'Emirados Árabes' },
  { iata: 'DOH', name: 'Aeroporto Internacional Hamad', city: 'Doha', country: 'Catar' },
  { iata: 'DEL', name: 'Aeroporto Internacional Indira Gandhi', city: 'Nova Delhi', country: 'Índia' },
  { iata: 'BOM', name: 'Aeroporto Internacional Chhatrapati Shivaji', city: 'Mumbai', country: 'Índia' },
  { iata: 'SYD', name: 'Aeroporto Internacional de Sydney', city: 'Sydney', country: 'Austrália' },
  { iata: 'MEL', name: 'Aeroporto Internacional de Melbourne', city: 'Melbourne', country: 'Austrália' },
  // África
  { iata: 'JNB', name: 'Aeroporto Internacional O. R. Tambo', city: 'Joanesburgo', country: 'África do Sul' },
  { iata: 'CPT', name: 'Aeroporto Internacional da Cidade do Cabo', city: 'Cidade do Cabo', country: 'África do Sul' },
  { iata: 'CMN', name: 'Aeroporto Internacional Mohammed V', city: 'Casablanca', country: 'Marrocos' },
  { iata: 'CAI', name: 'Aeroporto Internacional do Cairo', city: 'Cairo', country: 'Egito' },
]

export function searchAirports(query: string, limit = 8): Airport[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return AIRPORTS.filter(a =>
    a.iata.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q)
  ).slice(0, limit)
}
