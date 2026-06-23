import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { author_name, url } = body

  if (!author_name || !url) {
    return NextResponse.json(
      { error: 'Nom et URL requis' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('videos')
    .insert([
      {
        author_name: author_name.trim(),
        url: url.trim(),
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

  // First get the video to find its storage path
  const { data: video } = await supabase
    .from('videos')
    .select('url')
    .eq('id', id)
    .single()

  if (video?.url) {
    // Extract filename from URL to delete from storage
    try {
      const urlObj = new URL(video.url)
      const pathParts = urlObj.pathname.split('/')
      const fileName = pathParts[pathParts.length - 1]
      if (fileName) {
        await supabase.storage.from('videos').remove([fileName])
      }
    } catch {
      // ignore storage deletion error, still delete from DB
    }
  }

  const { error } = await supabase.from('videos').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
