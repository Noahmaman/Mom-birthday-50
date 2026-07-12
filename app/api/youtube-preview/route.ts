import { NextRequest, NextResponse } from 'next/server'

function decodeHtml(value: string) {
  return value
    .replace(/\\u0026/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim()
  if (!query) return NextResponse.json({ error: 'Recherche requise' }, { status: 400 })

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    const res = await fetch(searchUrl, {
      headers: {
        'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'user-agent': 'Mozilla/5.0',
      },
      next: { revalidate: 86400 },
    })

    if (!res.ok) return NextResponse.json({ error: 'YouTube indisponible' }, { status: 502 })

    const html = await res.text()
    const matches = [...html.matchAll(/"videoId":"([^"]{11})"[\s\S]{0,1200}?"title":\{"runs":\[\{"text":"([^"]+)"/g)]
    const match = matches.find((entry) => !/shorts/i.test(entry[0])) ?? matches[0]
    const videoId = match?.[1]

    if (!videoId) return NextResponse.json({ error: 'Aucune vidéo trouvée' }, { status: 404 })

    return NextResponse.json({
      videoId,
      title: match?.[2] ? decodeHtml(match[2]) : query,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    })
  } catch {
    return NextResponse.json({ error: 'Recherche impossible' }, { status: 500 })
  }
}
