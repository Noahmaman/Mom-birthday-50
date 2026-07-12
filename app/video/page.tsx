'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Clapperboard, Upload, Circle, Square, Check, RotateCcw, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'

type Step = 'choose' | 'record' | 'upload' | 'preview' | 'submitting' | 'success'

const MAX_DURATION = 90
const cartoonFont = '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "Marker Felt", cursive'
const travelFont = 'Georgia, "Palatino Linotype", "Book Antiqua", serif'

const kissOptions = [
  { language: 'Français', text: 'Bisous', flag: '🇫🇷' },
  { language: 'Français', text: 'Bisous Yael', flag: '🇫🇷' },
  { language: 'Anglais', text: 'Kisses', flag: '🇬🇧' },
  { language: 'Espagnol', text: 'Besos', flag: '🇪🇸' },
  { language: 'Italien', text: 'Baci', flag: '🇮🇹' },
  { language: 'Portugais', text: 'Beijos', flag: '🇵🇹' },
  { language: 'Allemand', text: 'Küsse', flag: '🇩🇪' },
  { language: 'Néerlandais', text: 'Kusjes', flag: '🇳🇱' },
  { language: 'Hébreu', text: 'Neshikot', flag: '🇮🇱' },
  { language: 'Arabe', text: 'Qoblat', flag: '🇲🇦' },
  { language: 'Russe', text: 'Potselui', flag: '🇷🇺' },
  { language: 'Polonais', text: 'Buziaki', flag: '🇵🇱' },
  { language: 'Grec', text: 'Filakia', flag: '🇬🇷' },
  { language: 'Turc', text: 'Öpücükler', flag: '🇹🇷' },
  { language: 'Japonais', text: 'Kisu', flag: '🇯🇵' },
  { language: 'Coréen', text: 'Kiseu', flag: '🇰🇷' },
  { language: 'Chinois', text: 'Qīn qīn', flag: '🇨🇳' },
  { language: 'Hindi', text: 'Chumban', flag: '🇮🇳' },
  { language: 'Suédois', text: 'Pussar', flag: '🇸🇪' },
  { language: 'Danois', text: 'Kys', flag: '🇩🇰' },
  { language: 'Norvégien', text: 'Kyss', flag: '🇳🇴' },
  { language: 'Finnois', text: 'Suukkoja', flag: '🇫🇮' },
  { language: 'Roumain', text: 'Pupici', flag: '🇷🇴' },
  { language: 'Hongrois', text: 'Puszik', flag: '🇭🇺' },
  { language: 'Tchèque', text: 'Pusinky', flag: '🇨🇿' },
  { language: 'Croate', text: 'Puse', flag: '🇭🇷' },
  { language: 'Serbe', text: 'Poljupci', flag: '🇷🇸' },
  { language: 'Indonésien', text: 'Ciuman', flag: '🇮🇩' },
  { language: 'Swahili', text: 'Mabusu', flag: '🇰🇪' },
  { language: 'Thaï', text: 'Jup jup', flag: '🇹🇭' },
  { language: 'Vietnamien', text: 'Những nụ hôn', flag: '🇻🇳' },
]

export default function VideoPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('choose')
  const [authorName, setAuthorName] = useState('')
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedKiss, setSelectedKiss] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const selectedKissOption = kissOptions.find((kiss) => kiss.text === selectedKiss)

  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const animationRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stopCanvasRendering = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const attachCameraPreview = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element
    if (!element || !streamRef.current) return

    element.srcObject = streamRef.current
    element.play().catch(() => {
      setError("La caméra est prête, mais l'aperçu n'a pas pu démarrer automatiquement.")
    })
  }, [])

  const drawCameraFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!video || !canvas || !context) return
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      animationRef.current = requestAnimationFrame(drawCameraFrame)
      return
    }

    const width = video.videoWidth || 720
    const height = video.videoHeight || 1280

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    context.save()
    context.translate(width, 0)
    context.scale(-1, 1)
    context.drawImage(video, 0, 0, width, height)
    context.restore()

    const gradientHeight = Math.max(170, height * 0.18)
    const gradient = context.createLinearGradient(0, height - gradientHeight, 0, height)
    gradient.addColorStop(0, 'rgba(30, 24, 18, 0)')
    gradient.addColorStop(1, 'rgba(30, 24, 18, 0.82)')
    context.fillStyle = gradient
    context.fillRect(0, height - gradientHeight, width, gradientHeight)

    const safeName = authorName.trim() || 'Pour Yael'
    const kissText = selectedKiss || 'Un message pour Yael'
    const kissFlag = selectedKissOption?.flag
    const fontSize = Math.max(34, Math.round(width * 0.065))
    context.font = `700 italic ${fontSize}px ${travelFont}`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = 'rgba(255, 255, 255, 0.96)'
    context.shadowColor = 'rgba(0, 0, 0, 0.45)'
    context.shadowBlur = 18
    context.lineWidth = Math.max(4, Math.round(width * 0.008))
    context.strokeStyle = 'rgba(30, 24, 18, 0.62)'
    context.strokeText(safeName, width / 2, height - Math.max(86, height * 0.085))
    context.fillText(safeName, width / 2, height - Math.max(86, height * 0.085))

    context.shadowBlur = 0
    context.font = `700 ${Math.max(20, Math.round(width * 0.036))}px ${cartoonFont}`
    context.fillStyle = 'rgba(255, 238, 170, 0.95)'
    context.strokeStyle = 'rgba(30, 24, 18, 0.56)'
    context.lineWidth = Math.max(3, Math.round(width * 0.006))
    context.textAlign = 'right'
    const kissX = width - Math.max(30, width * 0.045)
    const kissY = height - Math.max(42, height * 0.04)
    const renderedKiss = kissFlag ? `${kissText} ${kissFlag}` : kissText
    context.strokeText(renderedKiss, kissX, kissY)
    context.fillText(renderedKiss, kissX, kissY)

    animationRef.current = requestAnimationFrame(drawCameraFrame)
  }, [authorName, selectedKiss, selectedKissOption])

  const getRecorderMimeType = () => {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) return 'video/webm;codecs=vp9,opus'
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) return 'video/webm;codecs=vp8,opus'
    if (MediaRecorder.isTypeSupported('video/webm')) return 'video/webm'
    if (MediaRecorder.isTypeSupported('video/mp4')) return 'video/mp4'
    return ''
  }

  const getVideoExtension = (type: string) => {
    if (type.includes('mp4')) return 'mp4'
    if (type.includes('quicktime')) return 'mov'
    return 'webm'
  }

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      })
      streamRef.current = stream
      setStep('record')
      if (videoRef.current) attachCameraPreview(videoRef.current)
    } catch {
      setError("Impossible d'accéder à la caméra. Veuillez autoriser l'accès.")
    }
  }, [attachCameraPreview])

  const stopRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    stopCanvasRendering()
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop()
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null }
    if (videoRef.current) videoRef.current.srcObject = null
    setRecording(false)
  }, [stopCanvasRendering])

  const startRecording = useCallback(() => {
    if (!streamRef.current) return
    if (!authorName.trim()) {
      setError('Veuillez entrer votre prénom avant de filmer.')
      return
    }
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) {
      setError("L'aperçu caméra n'est pas encore prêt.")
      return
    }

    setError(null)
    chunksRef.current = []
    drawCameraFrame()

    const canvasStream = canvas.captureStream(30)
    streamRef.current.getAudioTracks().forEach((track) => canvasStream.addTrack(track))
    const mimeType = getRecorderMimeType()

    const recorder = mimeType
      ? new MediaRecorder(canvasStream, { mimeType })
      : new MediaRecorder(canvasStream)
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      stopCanvasRendering()
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'video/webm' })
      setVideoBlob(blob)
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      setStep('preview')
      if (previewRef.current) previewRef.current.src = url
    }

    recorder.start(100)
    setRecording(true)
    setRecordingTime(0)

    timerRef.current = setInterval(() => {
      setRecordingTime((t) => {
        if (t >= MAX_DURATION - 1) { stopRecording(); return MAX_DURATION }
        return t + 1
      })
    }, 1000)
  }, [authorName, drawCameraFrame, stopCanvasRendering, stopRecording])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      stopCanvasRendering()
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [stopCanvasRendering, videoUrl])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoBlob(file)
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    setStep('preview')
  }

  const handleSubmit = async () => {
    if (!authorName.trim()) { setError('Veuillez entrer votre nom'); return }
    if (!videoBlob) { setError('Aucune vidéo sélectionnée'); return }

    setStep('submitting')
    setError(null)
    setUploadProgress(0)

    try {
      const cleanName = authorName.trim().replace(/[^\w-]+/g, '-').replace(/-+/g, '-')
      const fileName = `${Date.now()}-${cleanName}.${getVideoExtension(videoBlob.type)}`
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoBlob, { contentType: videoBlob.type || 'video/webm', upsert: false })

      if (uploadError) throw uploadError
      setUploadProgress(80)

      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName)

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: authorName, url: urlData.publicUrl }),
      })
      if (!res.ok) throw new Error()

      setUploadProgress(100)
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload")
      setStep('preview')
    }
  }

  const handleRetake = () => {
    setVideoBlob(null)
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    setError(null)
    setRecordingTime(0)
    setStep('choose')
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="glass-card rounded-4xl p-8 max-w-sm w-full text-center card-shadow"
          style={{ background: 'linear-gradient(135deg, #EAE6F0 0%, #F0EBE2 100%)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7A6B9A 0%, #B87A6A 100%)' }}
          >
            <Check size={34} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-3xl font-light text-text-dark mb-2 font-display">Vidéo envoyée</h2>
          <p className="text-text-muted leading-relaxed font-sans text-sm">
            Merci {authorName} ! Votre message sera diffusé lors de la fête de Yael.
          </p>
          <Button className="w-full mt-6 font-sans" onClick={() => router.push('/')}>
            Retour à l&apos;accueil
          </Button>
        </motion.div>
      </div>
    )
  }

  if (step === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-4xl p-8 max-w-sm w-full text-center card-shadow"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #EAE6F0 0%, #D8D0E8 100%)' }}
          >
            <Loader2 size={28} strokeWidth={1.5} className="text-secondary" />
          </motion.div>
          <h2 className="text-xl font-light text-text-dark mb-1 font-display">Envoi en cours</h2>
          <p className="text-text-muted text-sm mb-6 font-sans">Veuillez patienter</p>
          <Progress value={uploadProgress} />
          <p className="text-text-muted text-xs mt-2 font-sans">{uploadProgress}%</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-5 pt-14 pb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <button
          onClick={() => { stopRecording(); router.back() }}
          className="w-10 h-10 glass-card rounded-full flex items-center justify-center card-shadow"
        >
          <ChevronLeft size={20} className="text-text-dark" />
        </button>
        <div>
          <h1 className="text-2xl font-light text-text-dark font-display">Message vidéo</h1>
          <p className="text-text-muted text-sm font-sans">Pour Yael avec amour</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <div className="mb-5 rounded-3xl bg-[#F6F1EB] p-5 card-shadow">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white">
              <Sparkles size={18} className="text-primary" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary font-sans">THE vidéo souvenir</p>
              <h2 className="text-xl font-light text-text-dark font-display">Pour la vidéo souvenir</h2>
            </div>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-text-dark font-sans">
            <p>
              <span className="font-semibold">1.</span> Racontez une petite anecdote, un souvenir marquant, un fou rire,
              quelques mots d&apos;amitié ou d&apos;amour. Laissez libre cours à votre inspiration.
            </p>
            <p>
              <span className="font-semibold">2.</span> À la fin de votre vidéo, terminez par un petit mot du type
              gros bisous, je t&apos;embrasse, je t&apos;aime ou je t&apos;adore, mais dans une langue étrangère.
            </p>
          </div>
        </div>

        <label className="block text-sm font-medium text-text-dark mb-2 font-sans">
          Votre prénom <span className="text-primary">*</span>
        </label>
        <Input placeholder="Entrez votre prénom" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-5">
        <div className="mb-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text-dark font-sans">Bisous dans 30 langues</p>
            <p className="text-xs text-text-muted font-sans">Optionnel, affiché sur votre vidéo.</p>
          </div>
          {selectedKiss && (
            <button onClick={() => setSelectedKiss(null)} className="text-xs font-semibold text-primary font-sans">
              Effacer
            </button>
          )}
        </div>
        <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-3xl bg-[#F6F1EB] p-3 no-scrollbar">
          {kissOptions.map((kiss) => {
            const selected = selectedKiss === kiss.text
            return (
              <button
                key={kiss.language}
                onClick={() => setSelectedKiss(selected ? null : kiss.text)}
                className={`rounded-2xl px-3 py-2 text-left text-xs font-semibold transition font-sans ${
                  selected ? 'bg-text-dark text-white' : 'bg-white text-text-dark'
                }`}
              >
                <span className="block">{kiss.text}</span>
                <span className={`block text-[10px] ${selected ? 'text-white/65' : 'text-text-muted'}`}>
                  {kiss.flag} {kiss.language}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'choose' && (
          <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={startCamera}
              className="w-full rounded-3xl p-6 flex items-center gap-4 card-shadow text-left"
              style={{ background: 'linear-gradient(135deg, #EAE6F0 0%, #D8D0E8 100%)' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0">
                <Clapperboard size={26} className="text-secondary" strokeWidth={1.6} />
              </div>
              <div>
                <p className="font-semibold text-text-dark text-base font-sans">Enregistrer une vidéo</p>
                <p className="text-text-muted text-sm mt-1 font-sans">Utilisez votre caméra · Max {MAX_DURATION}s</p>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-3xl p-6 flex items-center gap-4 card-shadow text-left"
              style={{ background: 'linear-gradient(135deg, #F0EBE2 0%, #E4D8C0 100%)' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0">
                <Upload size={26} className="text-accent-gold" strokeWidth={1.6} />
              </div>
              <div>
                <p className="font-semibold text-text-dark text-base font-sans">Télécharger une vidéo</p>
                <p className="text-text-muted text-sm mt-1 font-sans">Depuis votre galerie · MP4, WebM, MOV</p>
              </div>
            </motion.button>

            <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
            {error && <p className="text-red-500 text-sm font-medium px-1 font-sans">{error}</p>}
          </motion.div>
        )}

        {step === 'record' && (
          <motion.div key="record" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-[#F6F1EB] aspect-[3/4] max-h-[68vh] mx-auto card-shadow">
              <video ref={attachCameraPreview} autoPlay muted playsInline className="w-full h-full object-contain bg-[#F6F1EB]" style={{ transform: 'scaleX(-1)' }} />
              <canvas ref={canvasRef} className="hidden" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-6 pt-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                <p
                  className="text-white text-center text-3xl font-semibold drop-shadow-lg"
                  style={{ fontFamily: travelFont }}
                >
                  {authorName.trim() || 'Votre prénom'}
                </p>
                {selectedKissOption && (
                  <div className="mt-2 flex justify-end">
                    <p
                      className="rounded-full bg-black/45 px-4 py-2 text-right text-base font-bold backdrop-blur-sm drop-shadow-lg"
                      style={{ color: '#FFEFAA', fontFamily: cartoonFont }}
                    >
                      {selectedKissOption.text} <span className="ml-1">{selectedKissOption.flag}</span>
                    </p>
                  </div>
                )}
              </div>
              {recording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                  <span className="text-white text-sm font-medium font-sans">
                    {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')}
                  </span>
                </div>
              )}
              {recording && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-red-400 transition-all duration-1000" style={{ width: `${(recordingTime / MAX_DURATION) * 100}%` }} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-6">
              {!recording ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #B87A6A 0%, #9A5E4E 100%)' }}
                  disabled={!authorName.trim()}
                >
                  <Circle size={30} className="text-white" fill="white" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500"
                >
                  <Square size={26} className="text-white" fill="white" />
                </motion.button>
              )}
            </div>

            <p className="text-center text-text-muted text-sm font-sans">
              {recording ? `Enregistrement en cours · ${MAX_DURATION - recordingTime}s restantes` : 'Appuyez pour démarrer'}
            </p>
            {error && <p className="text-red-500 text-sm font-medium px-1 text-center font-sans">{error}</p>}
          </motion.div>
        )}

        {step === 'preview' && videoUrl && (
          <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-[#F6F1EB] aspect-[3/4] max-h-[68vh] mx-auto card-shadow">
              <video ref={previewRef} src={videoUrl} controls playsInline className="w-full h-full object-contain bg-[#F6F1EB]" />
              {videoBlob?.type && (
                <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm pointer-events-none">
                  <span className="text-white text-xs font-semibold font-sans">{authorName.trim()}</span>
                </div>
              )}
              {selectedKissOption && (
                <div className="absolute inset-x-0 bottom-3 flex justify-end px-4 pointer-events-none">
                  <span
                    className="rounded-full bg-black/55 px-4 py-2 text-sm font-bold backdrop-blur-sm"
                    style={{ color: '#FFEFAA', fontFamily: cartoonFont }}
                  >
                    {selectedKissOption.text} <span className="ml-1">{selectedKissOption.flag}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-4 card-shadow flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-sage/20 flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-accent-sage" strokeWidth={2.5} />
              </div>
              <p className="text-text-muted text-sm font-sans">Votre vidéo est prête à être envoyée</p>
            </div>

            {error && <p className="text-red-500 text-sm font-medium px-1 font-sans">{error}</p>}

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 font-sans" onClick={handleRetake}>
                <RotateCcw size={16} className="mr-2" />
                Recommencer
              </Button>
              <Button className="flex-1 font-sans" onClick={handleSubmit} disabled={!authorName.trim()}>
                <Check size={16} className="mr-2" />
                Envoyer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
