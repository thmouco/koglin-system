"use client"
import { useState, useEffect } from 'react'
import { Input } from './input'

const COUNTRIES = [
  { code: 'BR', name: 'Brasil', dial: '55', flag: '🇧🇷' },
  { code: 'US', name: 'EUA', dial: '1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', dial: '1', flag: '🇨🇦' },
  { code: 'GB', name: 'Reino Unido', dial: '44', flag: '🇬🇧' },
  { code: 'DE', name: 'Alemanha', dial: '49', flag: '🇩🇪' },
  { code: 'FR', name: 'França', dial: '33', flag: '🇫🇷' },
  { code: 'ES', name: 'Espanha', dial: '34', flag: '🇪🇸' },
  { code: 'IT', name: 'Itália', dial: '39', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', dial: '351', flag: '🇵🇹' },
  { code: 'NL', name: 'Países Baixos', dial: '31', flag: '🇳🇱' },
  { code: 'BE', name: 'Bélgica', dial: '32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suíça', dial: '41', flag: '🇨🇭' },
  { code: 'AT', name: 'Áustria', dial: '43', flag: '🇦🇹' },
  { code: 'SE', name: 'Suécia', dial: '46', flag: '🇸🇪' },
  { code: 'NO', name: 'Noruega', dial: '47', flag: '🇳🇴' },
  { code: 'DK', name: 'Dinamarca', dial: '45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlândia', dial: '358', flag: '🇫🇮' },
  { code: 'IE', name: 'Irlanda', dial: '353', flag: '🇮🇪' },
  { code: 'PL', name: 'Polônia', dial: '48', flag: '🇵🇱' },
  { code: 'CZ', name: 'Rep. Tcheca', dial: '420', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungria', dial: '36', flag: '🇭🇺' },
  { code: 'RO', name: 'Romênia', dial: '40', flag: '🇷🇴' },
  { code: 'GR', name: 'Grécia', dial: '30', flag: '🇬🇷' },
  { code: 'TR', name: 'Turquia', dial: '90', flag: '🇹🇷' },
  { code: 'RU', name: 'Rússia', dial: '7', flag: '🇷🇺' },
  { code: 'AR', name: 'Argentina', dial: '54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dial: '56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colômbia', dial: '57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dial: '51', flag: '🇵🇪' },
  { code: 'MX', name: 'México', dial: '52', flag: '🇲🇽' },
  { code: 'VE', name: 'Venezuela', dial: '58', flag: '🇻🇪' },
  { code: 'EC', name: 'Equador', dial: '593', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolívia', dial: '591', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguai', dial: '595', flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguai', dial: '598', flag: '🇺🇾' },
  { code: 'JP', name: 'Japão', dial: '81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dial: '86', flag: '🇨🇳' },
  { code: 'KR', name: 'Coreia do Sul', dial: '82', flag: '🇰🇷' },
  { code: 'IN', name: 'Índia', dial: '91', flag: '🇮🇳' },
  { code: 'AU', name: 'Austrália', dial: '61', flag: '🇦🇺' },
  { code: 'ZA', name: 'África do Sul', dial: '27', flag: '🇿🇦' },
  { code: 'AE', name: 'Emirados Árabes', dial: '971', flag: '🇦🇪' },
  { code: 'MA', name: 'Marrocos', dial: '212', flag: '🇲🇦' },
]

function parseValue(value: string) {
  if (!value) return { dial: '55', number: '' }
  const cleaned = value.startsWith('+') ? value.slice(1) : value
  const match = COUNTRIES.find(c => cleaned.startsWith(c.dial))
  if (match) return { dial: match.dial, number: cleaned.slice(match.dial.length) }
  return { dial: '55', number: value }
}

interface Props {
  value?: string | null
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export function PhoneInput({ value, onChange, placeholder = '99 99999-9999', className = '' }: Props) {
  const parsed = parseValue(value ?? '')
  const [dial, setDial] = useState(parsed.dial)
  const [number, setNumber] = useState(parsed.number)

  useEffect(() => {
    const p = parseValue(value ?? '')
    setDial(p.dial)
    setNumber(p.number)
  }, [value])

  function handleDial(d: string) {
    setDial(d)
    onChange(d + number)
  }

  function handleNumber(n: string) {
    const digits = n.replace(/\D/g, '')
    setNumber(digits)
    onChange(dial + digits)
  }

  const selected = COUNTRIES.find(c => c.dial === dial) ?? COUNTRIES[0]

  return (
    <div className={`flex gap-1.5 ${className}`}>
      <select
        value={dial}
        onChange={e => handleDial(e.target.value)}
        className="h-9 border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring w-[110px] flex-shrink-0"
        title={selected.name}
      >
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.dial}>
            {c.flag} +{c.dial}
          </option>
        ))}
      </select>
      <Input
        value={number}
        onChange={e => handleNumber(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        inputMode="numeric"
      />
    </div>
  )
}
