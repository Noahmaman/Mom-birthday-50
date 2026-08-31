'use client'
/* eslint-disable @next/next/no-img-element -- The private gallery serves original Supabase assets without transformation. */

import {FormEvent, useCallback, useEffect, useRef, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  Images,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Pause,
  Play,
  Sparkles,
  X,
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

type MemoryPhoto = {
  id: string
  author_name: string
  url: string
  created_at: string
}

type MemoriesContent = {
  photos: MemoryPhoto[]
  videoUrl: string
}

const EMPTY_PHOTOS: MemoryPhoto[] = []

const downloadBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}

const safeName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'souvenir'

const extensionFromUrl = (url: string) => {
  try {
    return new URL(url).pathname.split('.').pop()?.toLowerCase() || 'jpg'
  } catch {
    return 'jpg'
  }
}

export default function Memories50() {
  const [content, setContent] = useState<MemoriesContent | null>(null)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [code, setCode] = useState('')
  const [authError, setAuthError] = useState('')
  const [unlocking, setUnlocking] = useState(false)
  const [slideIndex, setSlideIndex] = useState<number | null>(null)
  const [autoPlay, setAutoPlay] = useState(true)
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [downloadError, setDownloadError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  const loadContent = useCallback(async () => {
    const response = await fetch('/api/memories-50/content', {cache: 'no-store'})
    if (response.status === 401) {
      setContent(null)
      setCheckingAccess(false)
      return false
    }
    if (!response.ok) throw new Error('Impossible de charger les souvenirs')
    setContent(await response.json())
    setCheckingAccess(false)
    return true
  }, [])

  useEffect(() => {
    loadContent().catch(() => setCheckingAccess(false))
  }, [loadContent])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !content?.videoUrl) return

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = content.videoUrl
      return
    }

    let hls: import('hls.js').default | undefined
    let cancelled = false

    void import('hls.js').then(({default: Hls}) => {
      if (cancelled || !Hls.isSupported()) return
      hls = new Hls({enableWorker: true, startLevel: -1})
      hls.loadSource(content.videoUrl)
      hls.attachMedia(video)
    })

    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [content?.videoUrl])

  const photos = content?.photos || EMPTY_PHOTOS
  const currentSlide = slideIndex === null ? null : photos[slideIndex]

  const previousSlide = useCallback(() => {
    setSlideIndex((current) => current === null ? null : (current - 1 + photos.length) % photos.length)
  }, [photos.length])

  const nextSlide = useCallback(() => {
    setSlideIndex((current) => current === null ? null : (current + 1) % photos.length)
  }, [photos.length])

  useEffect(() => {
    if (slideIndex === null || !autoPlay || photos.length < 2) return
    const timer = window.setInterval(nextSlide, 4000)
    return () => window.clearInterval(timer)
  }, [autoPlay, nextSlide, photos.length, slideIndex])

  useEffect(() => {
    if (slideIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSlideIndex(null)
      if (event.key === 'ArrowLeft') previousSlide()
      if (event.key === 'ArrowRight') nextSlide()
      if (event.key === ' ') {
        event.preventDefault()
        setAutoPlay((playing) => !playing)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [nextSlide, previousSlide, slideIndex])

  const unlock = async (event: FormEvent) => {
    event.preventDefault()
    setUnlocking(true)
    setAuthError('')
    try {
      const response = await fetch('/api/memories-50/auth', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({code}),
      })
      if (!response.ok) {
        setAuthError('Ce code ne fonctionne pas. Réessaie.')
        return
      }
      await loadContent()
    } catch {
      setAuthError('Impossible de se connecter pour le moment.')
    } finally {
      setUnlocking(false)
    }
  }

  const logout = async () => {
    await fetch('/api/memories-50/auth', {method: 'DELETE'})
    setContent(null)
    setCode('')
  }

  const projectVideo = async () => {
    const video = videoRef.current
    if (!video) return
    await video.requestFullscreen?.()
    await video.play().catch(() => undefined)
  }

  const downloadPhoto = async (photo: MemoryPhoto, index: number) => {
    try {
      const response = await fetch(photo.url)
      if (!response.ok) throw new Error('Téléchargement impossible')
      const blob = await response.blob()
      downloadBlob(blob, `${String(index + 1).padStart(2, '0')}-${safeName(photo.author_name)}.${extensionFromUrl(photo.url)}`)
    } catch {
      window.open(photo.url, '_blank', 'noopener,noreferrer')
    }
  }

  const downloadAll = async () => {
    if (!photos.length || downloadProgress !== null) return
    setDownloadProgress(0)
    setDownloadError('')
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      for (let index = 0; index < photos.length; index += 1) {
        const photo = photos[index]
        const response = await fetch(photo.url)
        if (!response.ok) throw new Error(photo.author_name)
        const blob = await response.blob()
        const fileName = `${String(index + 1).padStart(2, '0')}-${safeName(photo.author_name)}.${extensionFromUrl(photo.url)}`
        zip.file(fileName, blob)
        setDownloadProgress(Math.round(((index + 1) / photos.length) * 80))
      }
      const archive = await zip.generateAsync({type: 'blob'}, (metadata) => {
        setDownloadProgress(80 + Math.round(metadata.percent * 0.2))
      })
      downloadBlob(archive, 'souvenirs-50-ans-yael.zip')
    } catch {
      setDownloadError('Le téléchargement groupé a échoué. Les photos restent téléchargeables une par une.')
    } finally {
      setDownloadProgress(null)
    }
  }

  if (checkingAccess) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#17130f] text-[#f8efe1]">
        <LoaderCircle className="animate-spin" size={28} />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#17130f] text-[#f8efe1]">
        <div className="absolute inset-0 opacity-45" style={{background: 'radial-gradient(circle at 20% 20%, #8f5f66 0, transparent 35%), radial-gradient(circle at 82% 72%, #a17c52 0, transparent 32%)'}} />
        <img src="/covers/cover-4.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.14] mix-blend-luminosity" />
        <div className="relative flex min-h-full items-center justify-center px-5 py-12">
          <motion.div initial={{opacity: 0, y: 18}} animate={{opacity: 1, y: 0}} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-2xl sm:p-9">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8cba2]/35 bg-[#e8cba2]/10">
                <LockKeyhole size={19} className="text-[#e8cba2]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Album privé</span>
            </div>
            <p className="font-serif text-sm italic text-[#e8cba2]">Le film de sa vie, raconté par les siens</p>
            <h1 className="mt-3 font-serif text-5xl font-light leading-[0.95] sm:text-6xl">Yael,<br />50 ans</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/58">Entre le code reçu avec l’invitation pour accéder au film et à toutes les photos de la soirée.</p>
            <form onSubmit={unlock} className="mt-8 space-y-3">
              <label htmlFor="memories-code" className="sr-only">Code d’accès</label>
              <Input id="memories-code" type="password" autoComplete="current-password" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code d’accès" className="h-14 border border-white/10 bg-white/[0.07] text-base text-white placeholder:text-white/35 focus:bg-white/10" />
              {authError && <p className="text-sm text-[#ffb9ae]">{authError}</p>}
              <Button type="submit" disabled={!code || unlocking} className="h-14 w-full rounded-2xl bg-[#f2dec0] text-[#211b15] hover:bg-white">
                {unlocking ? <LoaderCircle className="mr-2 animate-spin" size={17} /> : <Sparkles className="mr-2" size={17} />}
                Ouvrir les souvenirs
              </Button>
            </form>
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
              <img src="/arrow-icon.png" alt="" className="h-3 w-3 opacity-70" /> Powered by Arrow AI
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-[60] min-h-screen overflow-hidden bg-[#f4eee5] text-[#211b15]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_18%_5%,rgba(155,102,95,.25),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(194,154,101,.28),transparent_30%)]" />
      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-5 pb-7 pt-7 sm:px-8 lg:px-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#9b665f]">Les souvenirs de</p>
          <h1 className="mt-1 font-serif text-3xl font-light sm:text-4xl">Yael — 50 ans</h1>
        </div>
        <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#211b15]/10 bg-white/50 text-[#665b50] backdrop-blur" aria-label="Fermer l’album">
          <LogOut size={16} />
        </button>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[1.75rem] bg-[#17130f] p-2 shadow-[0_30px_80px_rgba(49,36,25,.22)] sm:rounded-[2.25rem] sm:p-3">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-black sm:rounded-[1.6rem]">
            <video ref={videoRef} controls playsInline preload="metadata" poster="/covers/cover-4.png" className="aspect-video w-full bg-black object-contain" />
            <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md sm:left-6 sm:top-6">
              Film final · 9 min 34
            </div>
          </div>
          <div className="flex flex-col gap-4 px-3 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="font-serif text-xl sm:text-2xl">Le voyage de Yael</p>
              <p className="mt-1 text-xs text-white/45">Version finale · Qualité projection</p>
            </div>
            <Button onClick={projectVideo} className="h-12 rounded-full bg-[#f2dec0] px-6 text-[#211b15] hover:bg-white">
              <Expand className="mr-2" size={17} /> Projeter en plein écran
            </Button>
          </div>
        </section>

        <section className="pb-7 pt-16 sm:pt-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#9b665f]">
                <Images size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Album de la soirée</span>
              </div>
              <h2 className="font-serif text-4xl font-light sm:text-5xl">{photos.length} souvenirs,<br /><span className="italic text-[#9b665f]">un seul album.</span></h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => photos.length && setSlideIndex(0)} disabled={!photos.length} variant="outline" className="rounded-full border-[#211b15]/15 text-[#211b15]">
                <Play className="mr-2" size={15} /> Lancer le diaporama
              </Button>
              <Button onClick={downloadAll} disabled={!photos.length || downloadProgress !== null} className="rounded-full bg-[#211b15] text-white">
                {downloadProgress !== null ? <LoaderCircle className="mr-2 animate-spin" size={15} /> : <ArrowDownToLine className="mr-2" size={15} />}
                {downloadProgress !== null ? `${downloadProgress}%` : 'Tout télécharger'}
              </Button>
            </div>
          </div>
          {downloadError && <p className="mt-4 text-sm text-red-700">{downloadError}</p>}
        </section>

        {photos.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <motion.figure key={photo.id} initial={{opacity: 0, y: 14}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, margin: '-40px'}} transition={{delay: Math.min(index, 8) * 0.025}} className={`group relative overflow-hidden rounded-[1.4rem] bg-[#ddd2c4] [content-visibility:auto] ${index % 7 === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <button onClick={() => setSlideIndex(index)} className="block h-full min-h-48 w-full sm:min-h-64" aria-label={`Ouvrir ${photo.author_name} dans le diaporama`}>
                  <img src={photo.url} alt={photo.author_name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-75" />
                  <span className="absolute bottom-0 left-0 right-0 p-4 text-left sm:p-5">
                    <span className="block truncate font-serif text-base text-white sm:text-lg">{photo.author_name}</span>
                    <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">Souvenir #{String(index + 1).padStart(2, '0')}</span>
                  </span>
                </button>
                <button onClick={() => void downloadPhoto(photo, index)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 focus:opacity-100" aria-label={`Télécharger ${photo.author_name}`}>
                  <Download size={15} />
                </button>
              </motion.figure>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-[#211b15]/10 bg-white/45 px-6 py-16 text-center">
            <Images className="mx-auto text-[#9b665f]" size={28} />
            <p className="mt-3 font-serif text-2xl">Les photos arrivent bientôt</p>
          </div>
        )}
      </main>

      <footer className="relative border-t border-[#211b15]/10 px-5 py-8">
        <a href="https://arrow-ai.us" target="_blank" rel="noreferrer" className="mx-auto flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#665b50]">
          <img src="/arrow-icon.png" alt="" className="h-4 w-4" /> Powered by Arrow AI
        </a>
      </footer>

      <AnimatePresence>
        {currentSlide && slideIndex !== null && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 z-[100] flex flex-col bg-[#0e0c0a] text-white" role="dialog" aria-modal="true" aria-label="Diaporama des souvenirs">
            <div className="flex items-center justify-between px-4 py-4 sm:px-7">
              <div>
                <p className="font-serif text-lg">{currentSlide.author_name}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">{slideIndex + 1} / {photos.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setAutoPlay((playing) => !playing)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-label={autoPlay ? 'Mettre en pause' : 'Lire le diaporama'}>
                  {autoPlay ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button onClick={() => void downloadPhoto(currentSlide, slideIndex)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-label="Télécharger cette photo"><Download size={16} /></button>
                <button onClick={() => setSlideIndex(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-label="Fermer"><X size={18} /></button>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-5 sm:px-20">
              <AnimatePresence mode="wait">
                <motion.img key={currentSlide.id} initial={{opacity: 0, scale: .985}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 1.01}} transition={{duration: .35}} src={currentSlide.url} alt={currentSlide.author_name} className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" />
              </AnimatePresence>
              {photos.length > 1 && (
                <>
                  <button onClick={previousSlide} className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur sm:left-7" aria-label="Photo précédente"><ChevronLeft size={24} /></button>
                  <button onClick={nextSlide} className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur sm:right-7" aria-label="Photo suivante"><ChevronRight size={24} /></button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
