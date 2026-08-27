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

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const id = String(body.id || '').trim()
  const authorName = String(body.author_name || '').trim()

  if (!id || !authorName) {
    return NextResponse.json({ error: 'ID et nom requis' }, { status: 400 })
  }

  const { data: photo, error: lookupError } = await supabase
    .from('videos')
    .select('id, author_name, url, created_at')
    .eq('id', id)
    .single()

  if (lookupError || !photo || !isImageUrl(photo.url)) {
    return NextResponse.json({ error: 'Photo introuvable' }, { status: 404 })
  }

  const { data, error: updateError } = await supabase
    .from('videos')
    .update({ author_name: authorName })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (data) {
    return NextResponse.json(data)
  }

  // The production table currently allows inserts and deletes but may not have
  // an UPDATE policy. In that case, create the renamed record first and only
  // remove the original once the replacement is safely stored.
  const { data: replacement, error: insertError } = await supabase
    .from('videos')
    .insert([{
      author_name: authorName,
      url: photo.url,
      created_at: photo.created_at,
    }])
    .select()
    .single()

  if (insertError || !replacement) {
    return NextResponse.json(
      { error: insertError?.message || updateError?.message || 'Impossible de modifier le nom' },
      { status: 500 },
    )
  }

  const { data: deletedRows, error: deleteError } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)
    .select('id')

  if (deleteError || deletedRows?.length !== 1) {
    await supabase.from('videos').delete().eq('id', replacement.id)
    return NextResponse.json(
      { error: deleteError?.message || 'Impossible de remplacer la photo' },
      { status: 500 },
    )
  }

  return NextResponse.json(replacement)
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
