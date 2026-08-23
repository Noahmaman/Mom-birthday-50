import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isImageUrl } from '@/lib/media'

export async function GET() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json((data || []).filter((item) => isImageUrl(item.url)))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { author_name, url } = body

  if (!author_name || !url || !isImageUrl(url)) {
    return NextResponse.json({ error: 'Nom et image valides requis' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('videos')
    .insert([{ author_name: String(author_name).trim(), url: String(url).trim() }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 })
  }

  const { data: photo } = await supabase
    .from('videos')
    .select('url')
    .eq('id', id)
    .single()

  if (photo?.url && isImageUrl(photo.url)) {
    try {
      const fileName = new URL(photo.url).pathname.split('/').pop()
      if (fileName) await supabase.storage.from('videos').remove([fileName])
    } catch {
      // The database record should still be removed if storage cleanup fails.
    }
  }

  const { error } = await supabase.from('videos').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

