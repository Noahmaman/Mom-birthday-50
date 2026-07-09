'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  Download,
  ExternalLink,
  ListMusic,
  LogOut,
  Mail,
  MessageCircle,
  Music,
  Play,
  RefreshCw,
  Trash2,
  Users,
  Utensils,
  UserRound,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { Rsvp, Message, Video as VideoType, PlaylistItem } from '@/lib/supabase'
import { formatDate, getAttendingLabel, getAttendingColor, getPlatformColor } from '@/lib/utils'
import Image from 'next/image'

interface Stats {
  totalRsvps: number
  confirmed: number
  totalVideos: number
  totalMessages: number
  totalSongs: number
}

function StatCard({ value, label, color, Icon }: { value: number; label: string; color: string; Icon: LucideIcon }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-4 card-shadow flex flex-col items-center gap-2"
      style={{ background: color }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70">
        <Icon size={18} className="text-text-dark" strokeWidth={1.8} />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-text-dark"
      >
        {value}
      </motion.span>
      <span className="text-xs text-text-muted font-medium text-center leading-tight">{label}</span>
    </motion.div>
  )
}

function RsvpCard({ rsvp, onDelete }: { rsvp: Rsvp; onDelete: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card rounded-2xl p-4 card-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-text-dark">{rsvp.name}</h3>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getAttendingColor(rsvp.attending)}`}>
              {getAttendingLabel(rsvp.attending)}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-text-muted text-xs flex items-center gap-1">
              <Users size={12} />
              {rsvp.guests_count} invité{rsvp.guests_count !== 1 ? 's' : ''}
            </span>
            <span className="text-text-muted text-xs">{formatDate(rsvp.created_at)}</span>
          </div>
          {rsvp.email && (
            <p className="text-text-muted text-xs mt-1.5 flex items-center gap-1.5">
              <Mail size={12} />
              {rsvp.email}
            </p>
          )}
          {rsvp.allergies && (
            <p className="text-text-muted text-xs mt-1.5 italic flex items-center gap-1.5">
              <Utensils size={12} />
              {rsvp.allergies}
            </p>
          )}
          {rsvp.comment && (
            <p className="text-text-dark text-sm mt-2 leading-relaxed bg-white/50 rounded-xl p-2">
              &ldquo;{rsvp.comment}&rdquo;
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(rsvp.id)}
          className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center ml-3 flex-shrink-0"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

function MessageCard({ message, onDelete }: { message: Message; onDelete: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card rounded-2xl p-4 card-shadow"
      style={{ background: 'linear-gradient(135deg, #FFF8E4 0%, #FFFFFF 100%)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={16} className="text-accent-gold" />
            <span className="font-semibold text-text-dark">{message.author_name}</span>
          </div>
          <p className="text-text-dark text-sm leading-relaxed">{message.content}</p>
          <p className="text-text-muted text-xs mt-2">{formatDate(message.created_at)}</p>
        </div>
        <button
          onClick={() => onDelete(message.id)}
          className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center ml-3 flex-shrink-0"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

function VideoCard({ video, onDelete }: { video: VideoType; onDelete: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card rounded-3xl overflow-hidden card-shadow"
      style={{ background: 'linear-gradient(135deg, #EDE4F9 0%, #FFFFFF 100%)' }}
    >
      <div className="relative bg-black aspect-video">
        <video src={video.url} controls playsInline preload="metadata" className="h-full w-full object-contain" />
        <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-white text-xs font-semibold">{video.author_name}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #C9A7E8 0%, #F4A7B9 100%)' }}
              >
                <Video size={15} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-text-dark truncate">{video.author_name}</p>
                <p className="text-text-muted text-xs">{formatDate(video.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.open(video.url, '_blank')}
              className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center"
              aria-label="Ouvrir la vidéo"
            >
              <Play size={13} className="text-purple-500" />
            </button>
            <a
              href={video.url}
              download
              className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"
              aria-label="Télécharger la vidéo"
            >
              <Download size={13} className="text-blue-500" />
            </a>
            <button
              onClick={() => onDelete(video.id)}
              className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center"
              aria-label="Supprimer la vidéo"
            >
              <Trash2 size={13} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SongCard({ song, onDelete }: { song: PlaylistItem; onDelete: (id: string) => void }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card rounded-2xl p-4 card-shadow flex items-center gap-3"
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F4A7B9 0%, #C9A7E8 100%)' }}
      >
        {song.artwork_url && !imgError ? (
          <Image
            src={song.artwork_url}
            alt={song.title || 'Artwork'}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Music size={20} className="text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-dark text-sm truncate">{song.title || 'Titre inconnu'}</p>
        <p className="text-text-muted text-xs truncate">{song.artist || 'Artiste inconnu'}</p>
        {song.added_by && (
          <p className="text-text-muted text-xs">par {song.added_by}</p>
        )}
        {song.platform && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white mt-1 inline-block"
            style={{ background: getPlatformColor(song.platform) }}
          >
            {song.platform}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => window.open(song.url, '_blank')}
          className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center"
        >
          <ExternalLink size={14} className="text-green-500" />
        </button>
        <button
          onClick={() => onDelete(song.id)}
          className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [videos, setVideos] = useState<VideoType[]>([])
  const [songs, setSongs] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(true)

  const stats: Stats = {
    totalRsvps: rsvps.length,
    confirmed: rsvps.filter((r) => r.attending === 'yes').length,
    totalVideos: videos.length,
    totalMessages: messages.length,
    totalSongs: songs.length,
  }

  useEffect(() => {
    const auth = sessionStorage.getItem('admin-auth')
    if (!auth) {
      router.push('/admin')
      return
    }
  }, [router])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [rsvpRes, msgRes, vidRes, songRes] = await Promise.all([
        fetch('/api/rsvp'),
        fetch('/api/messages'),
        fetch('/api/videos'),
        fetch('/api/playlist'),
      ])

      if (rsvpRes.ok) setRsvps(await rsvpRes.json())
      if (msgRes.ok) setMessages(await msgRes.json())
      if (vidRes.ok) setVideos(await vidRes.json())
      if (songRes.ok) setSongs(await songRes.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth')
    router.push('/admin')
  }

  const deleteRsvp = async (id: string) => {
    setRsvps((prev) => prev.filter((r) => r.id !== id))
    await fetch(`/api/rsvp?id=${id}`, { method: 'DELETE' })
  }

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    await fetch(`/api/messages?id=${id}`, { method: 'DELETE' })
  }

  const deleteVideo = async (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id))
    await fetch(`/api/videos?id=${id}`, { method: 'DELETE' })
  }

  const deleteSong = async (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id))
    await fetch(`/api/playlist?id=${id}`, { method: 'DELETE' })
  }

  return (
    <div className="min-h-screen px-4 pt-14 pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-4xl overflow-hidden mb-6 card-shadow min-h-52 lg:min-h-64"
      >
        <Image
          src="/covers/cover-1.jpg"
          alt="Cover anniversaire"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/25 to-[#1E1812]/82" />
        <div className="relative z-10 p-5 min-h-52 flex flex-col justify-between lg:min-h-64 lg:p-7">
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-white/18 backdrop-blur-md rounded-full flex items-center justify-center"
              aria-label="Se déconnecter"
            >
              <LogOut size={18} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-white/75 text-xs font-semibold uppercase tracking-widest">Admin privé</p>
            <h1 className="text-4xl font-light text-white font-display mt-1 lg:text-5xl">Toutes les datas</h1>
            <p className="text-white/70 text-sm mt-1">RSVP, vidéos, messages et playlist</p>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3 lg:grid-cols-6"
        >
          <StatCard
            value={stats.totalRsvps}
            label="Total RSVP"
            color="linear-gradient(135deg, #FFE4E8 0%, #F9C6D0 100%)"
            Icon={Users}
          />
          <StatCard
            value={stats.confirmed}
            label="Confirmés"
            color="linear-gradient(135deg, #E4F9EE 0%, #C6F0DA 100%)"
            Icon={CheckCircle2}
          />
          <StatCard
            value={stats.totalVideos}
            label="Vidéos"
            color="linear-gradient(135deg, #EDE4F9 0%, #D9C6F0 100%)"
            Icon={Video}
          />
          <StatCard
            value={stats.totalMessages}
            label="Messages"
            color="linear-gradient(135deg, #FFF8E4 0%, #FFE4B0 100%)"
            Icon={MessageCircle}
          />
          <StatCard
            value={stats.totalSongs}
            label="Chansons"
            color="linear-gradient(135deg, #E4F0F9 0%, #C6D9F0 100%)"
            Icon={ListMusic}
          />
          <StatCard
            value={rsvps.reduce((acc, r) => acc + (r.guests_count || 1), 0)}
            label="Personnes"
            color="linear-gradient(135deg, #F9E4FF 0%, #ECC6F0 100%)"
            Icon={UserRound}
          />
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="rsvps">
          <TabsList className="grid h-auto w-full grid-cols-4 gap-1">
            <TabsTrigger value="rsvps" className="min-h-11 px-2 text-xs sm:text-sm">
              <Users size={15} className="mr-1 shrink-0" />
              <span className="hidden sm:inline">Invités</span>
              <span className="sm:hidden">({stats.totalRsvps})</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="min-h-11 px-2 text-xs sm:text-sm">
              <Video size={15} className="mr-1 shrink-0" />
              <span className="hidden sm:inline">Vidéos</span>
              <span className="sm:hidden">({stats.totalVideos})</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="min-h-11 px-2 text-xs sm:text-sm">
              <Mail size={15} className="mr-1 shrink-0" />
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">({stats.totalMessages})</span>
            </TabsTrigger>
            <TabsTrigger value="playlist" className="min-h-11 px-2 text-xs sm:text-sm">
              <Music size={15} className="mr-1 shrink-0" />
              <span className="hidden sm:inline">Playlist</span>
              <span className="sm:hidden">({stats.totalSongs})</span>
            </TabsTrigger>
          </TabsList>

          {/* RSVPs */}
          <TabsContent value="rsvps">
            <AnimatePresence>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-24 rounded-2xl" />
                  ))}
                </div>
              ) : rsvps.length === 0 ? (
                <EmptyState Icon={Users} message="Aucun RSVP pour l'instant" />
              ) : (
                <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                  {rsvps.map((rsvp) => (
                    <RsvpCard key={rsvp.id} rsvp={rsvp} onDelete={deleteRsvp} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Videos */}
          <TabsContent value="videos">
            <AnimatePresence>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-20 rounded-2xl" />
                  ))}
                </div>
              ) : videos.length === 0 ? (
                <EmptyState Icon={Video} message="Aucune vidéo pour l'instant" />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} onDelete={deleteVideo} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            <AnimatePresence>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-28 rounded-2xl" />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <EmptyState Icon={MessageCircle} message="Aucun message pour l'instant" />
              ) : (
                <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                  {messages.map((msg) => (
                    <MessageCard key={msg.id} message={msg} onDelete={deleteMessage} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Playlist */}
          <TabsContent value="playlist">
            <AnimatePresence>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-20 rounded-2xl" />
                  ))}
                </div>
              ) : songs.length === 0 ? (
                <EmptyState Icon={ListMusic} message="Aucune chanson pour l'instant" />
              ) : (
                <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                  {songs.map((song) => (
                    <SongCard key={song.id} song={song} onDelete={deleteSong} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>
      </div>

      {/* Refresh */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <Button variant="secondary" size="sm" onClick={fetchAll}>
          <RefreshCw size={14} className="mr-2" />
          Actualiser les données
        </Button>
      </motion.div>
    </div>
  )
}

function EmptyState({ Icon, message }: { Icon: LucideIcon; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80">
        <Icon size={26} className="text-text-muted" strokeWidth={1.7} />
      </div>
      <p className="text-text-muted text-sm">{message}</p>
    </motion.div>
  )
}
