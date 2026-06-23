'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Plus, ExternalLink, Trash2, Music } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { PlaylistItem } from '@/lib/supabase'
import { detectPlatform, getPlatformColor, extractYoutubeId } from '@/lib/utils'
import Image from 'next/image'

function PlatformBadge({ platform }: { platform: string }) {
  const color = getPlatformColor(platform)
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
      style={{ background: color }}
    >
      {platform}
    </span>
  )
}

function SongCard({ item, onDelete }: { item: PlaylistItem; onDelete: (id: string) => void }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className="glass-card rounded-2xl p-4 flex items-center gap-4 card-shadow"
    >
      {/* Artwork */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F4A7B9 0%, #C9A7E8 100%)' }}
      >
        {item.artwork_url && !imgError ? (
          <Image
            src={item.artwork_url}
            alt={item.title || 'Artwork'}
            width={56}
            height={56}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Music size={24} className="text-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-dark truncate text-sm">
          {item.title || 'Titre inconnu'}
        </p>
        <p className="text-text-muted text-xs truncate mt-0.5">
          {item.artist || 'Artiste inconnu'}
        </p>
        {item.added_by && (
          <p className="text-text-muted text-xs mt-1">Ajouté par {item.added_by}</p>
        )}
        <div className="mt-1.5">
          <PlatformBadge platform={item.platform || 'Autre'} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => window.open(item.url, '_blank')}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EDE4F9 0%, #D9C6F0 100%)' }}
        >
          <ExternalLink size={14} className="text-text-dark" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onDelete(item.id)}
          className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center"
        >
          <Trash2 size={14} className="text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function PlaylistPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [addedBy, setAddedBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [songs, setSongs] = useState<PlaylistItem[]>([])
  const [fetchingList, setFetchingList] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successAdded, setSuccessAdded] = useState(false)

  const fetchSongs = useCallback(async () => {
    try {
      const res = await fetch('/api/playlist')
      if (res.ok) {
        const data = await res.json()
        setSongs(data)
      }
    } catch {
      // ignore
    } finally {
      setFetchingList(false)
    }
  }, [])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  const extractMetadata = (inputUrl: string): { title?: string; artist?: string; artwork_url?: string } => {
    const ytId = extractYoutubeId(inputUrl)
    if (ytId) {
      return {
        title: 'Vidéo YouTube',
        artist: 'YouTube',
        artwork_url: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
      }
    }
    // For Spotify/Apple Music, return minimal data; a real app would use oEmbed
    return {}
  }

  const handleAdd = async () => {
    if (!url.trim()) {
      setError('Veuillez coller un lien de chanson')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError('Lien invalide. Collez un lien Spotify, YouTube ou Apple Music.')
      return
    }

    setLoading(true)
    setError(null)

    const platform = detectPlatform(url)
    const metadata = extractMetadata(url)

    try {
      const res = await fetch('/api/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          platform,
          added_by: addedBy || undefined,
          ...metadata,
        }),
      })

      if (!res.ok) throw new Error('Erreur')

      const newItem = await res.json()
      setSongs((prev) => [newItem, ...prev])
      setUrl('')
      setSuccessAdded(true)
      setTimeout(() => setSuccessAdded(false), 3000)
    } catch {
      setError('Erreur lors de l\'ajout. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id))
    try {
      await fetch(`/api/playlist?id=${id}`, { method: 'DELETE' })
    } catch {
      // re-fetch on error
      fetchSongs()
    }
  }

  return (
    <div className="min-h-screen px-5 pt-14 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 glass-card rounded-full flex items-center justify-center card-shadow"
        >
          <ChevronLeft size={20} className="text-text-dark" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-dark">La playlist de Maman</h1>
          <p className="text-text-muted text-sm">
            {songs.length} chanson{songs.length !== 1 ? 's' : ''} 🎵
          </p>
        </div>
      </motion.div>

      {/* Add song */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-5 mb-6 card-shadow"
        style={{ background: 'linear-gradient(135deg, #E4F9EE 0%, #F9F4FF 100%)' }}
      >
        <h2 className="font-semibold text-text-dark mb-4">Ajouter une chanson</h2>

        <div className="space-y-3">
          <Input
            placeholder="Coller le lien Spotify, YouTube, Apple Music..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white/70"
          />
          <Input
            placeholder="Votre prénom (optionnel)"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            className="bg-white/70"
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600 font-medium"
              >
                {error}
              </motion.p>
            )}
            {successAdded && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-green-600 font-medium"
              >
                ✅ Chanson ajoutée à la playlist !
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            className="w-full rounded-2xl"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Ajout en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Ajouter à la playlist
              </div>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Platform hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-5 flex-wrap"
      >
        <span className="text-xs text-text-muted">Compatible :</span>
        {['Spotify', 'YouTube', 'Apple Music', 'Deezer'].map((p) => (
          <span
            key={p}
            className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
            style={{ background: getPlatformColor(p) }}
          >
            {p}
          </span>
        ))}
      </motion.div>

      {/* Song list */}
      {fetchingList ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-16"
        >
          <div className="text-5xl mb-4">🎵</div>
          <p className="text-text-dark font-semibold mb-1">Pas encore de chansons</p>
          <p className="text-text-muted text-sm">
            Soyez le premier à ajouter une chanson !
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {songs.map((song) => (
              <SongCard key={song.id} item={song} onDelete={handleDelete} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
