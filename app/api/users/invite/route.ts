import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, role, full_name, phone, whatsapp } = await req.json()

    if (!email || !role || !full_name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check caller is admin
    const authHeader = req.headers.get('cookie')

    // Invite user via Supabase Admin API
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name, role },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If user was created, ensure profile is correct
    if (data.user) {
      await supabase
        .from('users')
        .upsert({ id: data.user.id, email, full_name, role, phone: phone || null, whatsapp: whatsapp || null }, { onConflict: 'id' })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
