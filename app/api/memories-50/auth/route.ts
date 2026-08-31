import {NextRequest, NextResponse} from 'next/server'
import {
  getMemoriesAccessToken,
  isValidMemoriesCode,
  MEMORIES_COOKIE_NAME,
} from '@/lib/memories-auth'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const code = typeof body.code === 'string' ? body.code : ''

  if (!isValidMemoriesCode(code)) {
    return NextResponse.json({error: 'Code incorrect'}, {status: 401})
  }

  const response = NextResponse.json({success: true})
  response.cookies.set(MEMORIES_COOKIE_NAME, getMemoriesAccessToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({success: true})
  response.cookies.set(MEMORIES_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
