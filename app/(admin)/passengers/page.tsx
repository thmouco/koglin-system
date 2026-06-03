import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { PassengersClient } from './PassengersClient'

export default async function PassengersPage() {
  const supabase = createClient()

  const [{ data: passengers }, { data: groups }, { data: airlines }, { data: cruiseLines }, { data: bedTypes }] = await Promise.all([
    supabase.from('passengers').select(`
      id, first_name, last_name, email, phone, whatsapp,
      passport_number, company_name, hotel_name, checkin_date, checkout_date,
      departure_date, return_date, group_id, birth_date,
      departure_airline, departure_airport, departure_time,
      return_airline, return_airport, return_time,
      room_category, bed_type, ship_number, deck, cabin_category, cabin_type,
      group:groups!passengers_group_id_fkey(id, name)
    `).order('first_name'),
    supabase.from('groups').select('id, name').order('name'),
    supabase.from('airlines').select('id, name, iata_code').order('name'),
    supabase.from('cruise_lines').select('id, name').order('name'),
    supabase.from('bed_types').select('id, name').order('name'),
  ])

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Passageiros" subtitle="Todos os passageiros cadastrados" user={null as any} />
      <main className="flex-1 p-6">
        <PassengersClient
          passengers={passengers ?? []}
          groups={groups ?? []}
          airlines={airlines ?? []}
          cruiseLines={cruiseLines ?? []}
          bedTypes={bedTypes ?? []}
        />
      </main>
    </div>
  )
}
