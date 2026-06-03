"use client"
import { useState, useRef, useEffect } from 'react'
import { searchAirports } from '@/lib/airports'

interface Props {
  value?: string | null
  onChange: (v: string) => void
  placeholder?: string
}

export function AirportInput({ value, onChange, placeholder = 'Digite IATA ou cidade...' }: Props) {
  const [query, setQuery] = useState(value ?? '')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value ?? '') }, [value])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const results = searchAirports(query)

  function handleInput(v: string) {
    setQuery(v)
    onChange(v)
    setOpen(v.length >= 2)
  }

  function select(iata: string, city: string) {
    const val = `${iata} – ${city}`
    setQuery(val)
    onChange(val)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <input
        value={query}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => query.length >= 2 && setOpen(true)}
        placeholder={placeholder}
        className="flex h-9 w-full border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-auto">
          {results.map(a => (
            <button
              key={a.iata}
              type="button"
              onMouseDown={e => { e.preventDefault(); select(a.iata, a.city) }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <span className="font-mono font-bold text-[#00204a] w-10 flex-shrink-0">{a.iata}</span>
              <span className="flex-1 truncate">{a.city}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">{a.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
