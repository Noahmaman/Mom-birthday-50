import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, guests_count, attending, allergies, comment } = body

  if (!name || !attending) {
    return NextResponse.json(
      { error: 'Nom et présence requis' },
      { status: 400 }
    )
  }

  if (!['yes', 'no', 'maybe'].includes(attending)) {
    return NextResponse.json(
      { error: 'Valeur de présence invalide' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase.from('rsvps').insert([
    {
      name: name.trim(),
      guests_count: guests_count ?? 1,
      attending,
      allergies: allergies?.trim() || null,
      comment: comment?.trim() || null,
    },
  ]).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 })
  }

  const { error } = await supabase.from('rsvps').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
