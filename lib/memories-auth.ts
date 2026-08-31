import {createHash, createHmac, timingSafeEqual} from 'node:crypto'

export const MEMORIES_COOKIE_NAME = 'memories_50_access'

const accessCode = process.env.MEMORIES_50_ACCESS_CODE || 'Annivdeyaelle50'
const cookieSecret = process.env.MEMORIES_50_COOKIE_SECRET || `${accessCode}:arrow-ai:yael-50`

const digest = (value: string) => createHash('sha256').update(value).digest()

export function isValidMemoriesCode(value: string) {
  const received = digest(value)
  const expected = digest(accessCode)
  return timingSafeEqual(received, expected)
}

export function getMemoriesAccessToken() {
  return createHmac('sha256', cookieSecret).update('memories-50').digest('hex')
}

export function hasMemoriesAccess(cookieValue?: string) {
  if (!cookieValue) return false
  const received = Buffer.from(cookieValue)
  const expected = Buffer.from(getMemoriesAccessToken())
  return received.length === expected.length && timingSafeEqual(received, expected)
}
