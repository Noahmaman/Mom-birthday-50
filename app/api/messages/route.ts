import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { author_name, content } = body

  if (!author_name || !content) {
    return NextResponse.json(
      { error: 'Nom et contenu requis' },
      { status: 400 }
    )
  }

  if (content.length > 500) {
    return NextResponse.json(
      { error: 'Message trop long (500 caractères max)' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        author_name: author_name.trim(),
        content: content.trim(),
      },
    ])
    .select()
    .single()

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

  const { error } = await supabase.from('messages').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
