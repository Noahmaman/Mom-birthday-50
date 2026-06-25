'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Plus, ExternalLink, Trash2, Music2, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { PlaylistItem } from '@/lib/supabase'
import { detectPlatform, getPlatformColor, extractYoutubeId } from '@/lib/utils'
import Image from 'next/image'

/* ── Curated suggestions ──────────────────────────────────────── */
const SUGGESTED_SONGS = [
  { title: 'La Vie en Rose', artist: 'Édith Piaf', color: '#B87A6A', search: 'Edith Piaf La Vie en Rose' },
  { title: "Je l'aime à mourir", artist: 'Francis Cabrel', color: '#7A6B9A', search: 'Francis Cabrel Je l aime a mourir' },
  { title: "Pour que tu m'aimes encore", artist: 'Céline Dion', color: '#6A9A8A', search: 'Celine Dion Pour que tu maimes encore' },
  { title: "L'Hymne à l'amour", artist: 'Édith Piaf', color: '#B8965A', search: 'Edith Piaf Hymne a l amour' },
  { title: "Et si tu n'existais pas", artist: 'Joe Dassin', color: '#B87A6A', search: 'Joe Dassin Et si tu n existais pas' },
  { title: 'La Bohème', artist: 'Charles Aznavour', color: '#7A6B9A', search: 'Charles Aznavour La Bohème' },
  { title: 'Perfect', artist: 'Ed Sheeran', color: '#6A9A8A', search: 'Ed Sheeran Perfect' },
  { title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', color: '#B8965A', search: 'Lady Gaga Shallow' },
  { title: 'Quelque chose de Tennessee', artist: 'Johnny Hallyday', color: '#B87A6A', search: 'Johnny Hallyday Quelque chose de Tennessee' },
  { title: 'Non, je ne regrette rien', artist: 'Édith Piaf', color: '#7A6B9A', search: 'Edith Piaf Non je ne regrette rien' },
]

/* ── Platform badge ───────────────────────────────────────────── */
function PlatformBadge({ platform }: { platform: string }) {
  const color = getPlatformColor(platform)
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white font-sans" style={{ background: color }}>
      {platform}
    </span>
  )
}

/* ── Song card ────────────────────────────────────────────────── */
function SongCard({ item, onDelete }: { item: PlaylistItem; onDelete: (id: string) => void }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className="glass-card rounded-2xl p-4 flex items-center gap-4 card-shadow"
    >
      <div
        className="w-13 h-13 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
        style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #F2ECE6 0%, #EAE6F0 100%)' }}
      >
        {item.artwork_url && !imgError ? (
          <Image src={item.artwork_url} alt={item.title || ''} width={52} height={52} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <Music2 size={20} className="text-text-muted" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-dark truncate text-sm font-sans">{item.title || 'Titre inconnu'}</p>
        <p className="text-text-muted text-xs truncate mt-0.5 font-sans">{item.artist || 'Artiste inconnu'}</p>
        {item.added_by && <p className="text-text-muted text-[10px] mt-0.5 font-sans">par {item.added_by}</p>}
        <div className="mt-1.5"><PlatformBadge platform={item.platform || 'Autre'} /></div>
      </div>

      <div className="flex flex-col gap-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => window.open(item.url, '_blank')}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EAE6F0 0%, #D8D0E8 100%)' }}
        >
          <ExternalLink size={13} className="text-secondary" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onDelete(item.id)}
          className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center"
        >
          <Trash2 size={13} className="text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ── Suggestion card ──────────────────────────────────────────── */
function SuggestionCard({
  song,
  onPick,
}: {
  song: typeof SUGGESTED_SONGS[0]
  onPick: (s: typeof SUGGESTED_SONGS[0]) => void
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.94 }}
      onClick={() => onPick(song)}
      className="flex-shrink-0 w-40 rounded-2xl p-3.5 cursor-pointer card-shadow flex flex-col gap-2"
      style={{ background: `linear-gradient(135deg, ${song.color}18 0%, ${song.color}30 100%)`, border: `1px solid ${song.color}22` }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${song.color}25` }}>
        <Play size={16} strokeWidth={1.8} style={{ color: song.color }} />
      </div>
      <div>
        <p className="text-xs font-semibold text-text-dark leading-tight font-sans line-clamp-2">{song.title}</p>
        <p className="text-[10px] text-text-muted mt-0.5 font-sans truncate">{song.artist}</p>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider font-sans" style={{ color: song.color }}>
        Ajouter
      </span>
    </motion.div>
  )
}

/* ── Main page ────────────────────────────────────────────────── */
export default function PlaylistPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [addedBy, setAddedBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [songs, setSongs] = useState<PlaylistItem[]>([])
  const [fetchingList, setFetchingList] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successAdded, setSuccessAdded] = useState(false)
  const [pickedSong, setPickedSong] = useState<typeof SUGGESTED_SONGS[0] | null>(null)

  const fetchSongs = useCallback(async () => {
    try {
      const res = await fetch('/api/playlist')
      if (res.ok) setSongs(await res.json())
    } catch { /* noop */ } finally { setFetchingList(false) }
  }, [])

  useEffect(() => { fetchSongs() }, [fetchSongs])

  const extractMetadata = (inputUrl: string) => {
    const ytId = extractYoutubeId(inputUrl)
    if (ytId) return { title: pickedSong?.title || 'Vidéo YouTube', artist: pickedSong?.artist || 'YouTube', artwork_url: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` }
    return {}
  }

  const handleAdd = async (overrideUrl?: string) => {
    const target = overrideUrl || url
    if (!target.trim()) { setError('Veuillez coller un lien'); return }
    try { new URL(target) } catch { setError('Lien invalide.'); return }

    setLoading(true)
    setError(null)
    const platform = detectPlatform(target)
    const metadata = extractMetadata(target)

    try {
      const res = await fetch('/api/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target, platform, added_by: addedBy || undefined, ...metadata }),
      })
      if (!res.ok) throw new Error()
      const newItem = await res.json()
      setSongs((prev) => [newItem, ...prev])
      setUrl('')
      setPickedSong(null)
      setSuccessAdded(true)
      setTimeout(() => setSuccessAdded(false), 3000)
    } catch {
      setError("Erreur lors de l'ajout. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  const handlePickSuggestion = (song: typeof SUGGESTED_SONGS[0]) => {
    setPickedSong(song)
    const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.search)}`
    window.open(ytSearch, '_blank')
    setUrl('')
    setError(null)
  }

  const handleDelete = async (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id))
    try { await fetch(`/api/playlist?id=${id}`, { method: 'DELETE' }) } catch { fetchSongs() }
  }

  return (
    <div className="min-h-screen px-5 pt-14 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="w-10 h-10 glass-card rounded-full flex items-center justify-center card-shadow">
          <ChevronLeft size={20} className="text-text-dark" />
        </button>
        <div>
          <h1 className="text-2xl font-light text-text-dark font-display">La playlist de Maman</h1>
          <p className="text-text-muted text-sm font-sans">{songs.length} chanson{songs.length !== 1 ? 's' : ''}</p>
        </div>
      </motion.div>

      {/* ── Suggestions ───────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 font-sans">
          Suggestions YouTube
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
          {SUGGESTED_SONGS.map((song) => (
            <SuggestionCard key={song.title} song={song} onPick={handlePickSuggestion} />
          ))}
        </div>
        <AnimatePresence>
          {pickedSong && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-2xl p-3.5 font-sans text-xs"
              style={{ background: `${pickedSong.color}18`, border: `1px solid ${pickedSong.color}30` }}
            >
              <p className="font-semibold text-text-dark mb-0.5" style={{ color: pickedSong.color }}>
                {pickedSong.title} — {pickedSong.artist}
              </p>
              <p className="text-text-muted">
                YouTube vient de s&apos;ouvrir. Copiez le lien de la vidéo et collez-le ci-dessous.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Add song ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-5 mb-6 card-shadow"
        style={{ background: 'linear-gradient(135deg, #F6F1EB 0%, #F0EBE6 100%)' }}
      >
        <h2 className="font-medium text-text-dark mb-4 font-sans text-sm">Ajouter un lien</h2>
        <div className="space-y-3">
          <Input
            placeholder={pickedSong ? `Collez le lien YouTube de « ${pickedSong.title} »…` : 'Lien YouTube, Spotify, Apple Music…'}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white/70 font-sans"
          />
          <Input
            placeholder="Votre prénom (optionnel)"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            className="bg-white/70 font-sans"
          />

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm text-red-600 font-medium font-sans">
                {error}
              </motion.p>
            )}
            {successAdded && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm font-medium font-sans text-accent-sage">
                Chanson ajoutée à la playlist
              </motion.p>
            )}
          </AnimatePresence>

          <Button className="w-full rounded-2xl font-sans" onClick={() => handleAdd()} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Ajout en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus size={17} />
                Ajouter à la playlist
              </div>
            )}
          </Button>
        </div>
      </motion.div>

      {/* ── Platform hint ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-xs text-text-muted font-sans">Compatible :</span>
        {['YouTube', 'Spotify', 'Apple Music', 'Deezer'].map((p) => (
          <span key={p} className="text-xs font-medium px-2.5 py-0.5 rounded-full text-white font-sans" style={{ background: getPlatformColor(p) }}>
            {p}
          </span>
        ))}
      </motion.div>

      {/* ── Song list ─────────────────────────────────────── */}
      {fetchingList ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : songs.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E6EFEC 0%, #D0E4DD 100%)' }}>
            <Music2 size={26} className="text-accent-sage" strokeWidth={1.5} />
          </div>
          <p className="text-text-dark font-medium font-sans mb-1">Pas encore de chansons</p>
          <p className="text-text-muted text-sm font-sans">Soyez le premier à en ajouter une !</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {songs.map((song) => <SongCard key={song.id} item={song} onDelete={handleDelete} />)}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
