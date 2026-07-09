import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/* ── Metadata fetchers via oEmbed (no API key needed) ─────────── */

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^#&?/]*)/,
    /youtube\.com\/watch\?v=([^#&?]*)/,
    /youtube\.com\/shorts\/([^#&?/]*)/,
    /youtube\.com\/embed\/([^#&?/]*)/,
    /youtube\.com\/v\/([^#&?/]*)/,
    /m\.youtube\.com\/watch\?v=([^#&?]*)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

async function fetchYoutubeMetadata(url: string) {
  try {
    const videoId = extractYoutubeId(url)
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title as string,
      artist: (data.author_name as string).replace(' - Topic', '').replace(' - VEVO', ''),
      artwork_url: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : data.thumbnail_url as string,
    }
  } catch {
    return null
  }
}

async function fetchSpotifyMetadata(url: string) {
  try {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title as string,
      artist: undefined as string | undefined,
      artwork_url: data.thumbnail_url as string,
    }
  } catch {
    return null
  }
}

async function enrichMetadata(url: string, platform: string) {
  if (platform === 'YouTube') return fetchYoutubeMetadata(url)
  if (platform === 'Spotify') return fetchSpotifyMetadata(url)
  return null
}

function detectPlatform(url: string): string {
  if (url.includes('spotify.com')) return 'Spotify'
  if (url.includes('music.apple.com')) return 'Apple Music'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('deezer.com')) return 'Deezer'
  return 'Autre'
}

/* ── Routes ───────────────────────────────────────────────────── */

export async function GET() {
  const { data, error } = await supabase
    .from('playlist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { url, added_by } = body

  if (!url) return NextResponse.json({ error: 'URL requise' }, { status: 400 })
  try { new URL(url) } catch { return NextResponse.json({ error: 'URL invalide' }, { status: 400 }) }

  const platform = detectPlatform(url)

  // Always try to fetch real metadata server-side
  const meta = await enrichMetadata(url.trim(), platform)

  const { data, error } = await supabase
    .from('playlist')
    .insert([{
      url: url.trim(),
      title: meta?.title ?? body.title ?? null,
      artist: meta?.artist ?? body.artist ?? null,
      artwork_url: meta?.artwork_url ?? body.artwork_url ?? null,
      platform,
      added_by: added_by?.trim() || null,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

  const { error } = await supabase.from('playlist').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
