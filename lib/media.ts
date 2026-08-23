const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif', 'avif'])

export function isImageUrl(url: string) {
  try {
    const pathname = new URL(url).pathname
    const extension = pathname.split('.').pop()?.toLowerCase() || ''
    return IMAGE_EXTENSIONS.has(extension)
  } catch {
    return false
  }
}

