import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function detectPlatform(url: string): string {
  if (url.includes('spotify.com')) return 'Spotify'
  if (url.includes('music.apple.com')) return 'Apple Music'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('deezer.com')) return 'Deezer'
  if (url.includes('tidal.com')) return 'Tidal'
  return 'Autre'
}

export function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'Spotify': return '#1DB954'
    case 'Apple Music': return '#FC3C44'
    case 'YouTube': return '#FF0000'
    case 'Deezer': return '#EF5466'
    case 'Tidal': return '#00FFFF'
    default: return '#8E8E93'
  }
}

export function getPlatformEmoji(platform: string): string {
  switch (platform) {
    case 'Spotify': return '🎵'
    case 'Apple Music': return '🎵'
    case 'YouTube': return '▶️'
    case 'Deezer': return '🎶'
    case 'Tidal': return '🌊'
    default: return '🎵'
  }
}

export function getAttendingLabel(attending: string): string {
  switch (attending) {
    case 'yes': return 'Présent(e) ✅'
    case 'no': return 'Absent(e) ❌'
    case 'maybe': return 'Peut-être 🤔'
    default: return attending
  }
}

export function getAttendingColor(attending: string): string {
  switch (attending) {
    case 'yes': return 'bg-green-100 text-green-700'
    case 'no': return 'bg-red-100 text-red-700'
    case 'maybe': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export async function extractYoutubeMetadata(url: string): Promise<{
  title?: string
  artist?: string
  artwork_url?: string
}> {
  try {
    const videoId = extractYoutubeId(url)
    if (videoId) {
      return {
        title: 'Vidéo YouTube',
        artist: 'YouTube',
        artwork_url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      }
    }
  } catch {
    // ignore
  }
  return {}
}

export function extractYoutubeId(url: string): string | null {
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
