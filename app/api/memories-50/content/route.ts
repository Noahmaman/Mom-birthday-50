import {NextRequest, NextResponse} from 'next/server'
import {hasMemoriesAccess, MEMORIES_COOKIE_NAME} from '@/lib/memories-auth'
import {isImageUrl} from '@/lib/media'
import {supabase} from '@/lib/supabase'

export async function GET(request: NextRequest) {
  if (!hasMemoriesAccess(request.cookies.get(MEMORIES_COOKIE_NAME)?.value)) {
    return NextResponse.json({error: 'Accès non autorisé'}, {status: 401})
  }

  const {data, error} = await supabase
    .from('videos')
    .select('id, author_name, url, created_at')
    .order('created_at', {ascending: false})

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const videoUrl = `${supabaseUrl}/storage/v1/object/public/videos/memories-50/e0f378db/index.m3u8`
  const photos = (data || []).filter((item) => isImageUrl(item.url))

  return NextResponse.json(
    {photos, videoUrl},
    {headers: {'Cache-Control': 'private, no-store'}},
  )
}
