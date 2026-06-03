import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { PassengersClient } from '@/app/(admin)/passengers/PassengersClient'

export default async function MyGroupPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: myGroup } = await supabase
    .from('groups')
    .select('id, name')
    .eq('guide_id', user!.id)
    .single()

  const { data: passengers } = await supabase
    .from('passengers')
    .select(`
      id, first_name, last_name, email, phone, whatsapp,
      passport_number, company_name, hotel_name, room_category, bed_type,
      checkin_date, checkout_date,
      departure_airline, departure_airport, departure_date, departure_time,
      return_airline, return_airport, return_date, return_time,
      ship_number, deck, cabin_category, cabin_type,
      group_id, group:groups!passengers_group_id_fkey(id, name)
    `)
    .eq('group_id', myGroup?.id ?? '')
    .order('first_name')

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header
        title="Meu Grupo"
        subtitle={myGroup ? `${myGroup.name} — ${passengers?.length ?? 0} passageiros` : 'Nenhum grupo atribuído'}
        user={null as any}
      />
      <main className="flex-1 p-6">
        {!myGroup ? (
          <div className="text-center py-16 text-muted-foreground">
            Você não está atribuído a nenhum grupo ainda. Contacte um administrador.
          </div>
        ) : (
          <PassengersClient passengers={passengers ?? []} groups={myGroup ? [myGroup] : []} />
        )}
      </main>
    </div>
  )
}
