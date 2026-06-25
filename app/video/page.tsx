'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Clapperboard, Upload, Circle, Square, Check, RotateCcw, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'

type Step = 'choose' | 'record' | 'upload' | 'preview' | 'submitting' | 'success'

const MAX_DURATION = 90

export default function VideoPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('choose')
  const [authorName, setAuthorName] = useState('')
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setStep('record')
    } catch {
      setError("Impossible d'accéder à la caméra. Veuillez autoriser l'accès.")
    }
  }, [])

  const startRecording = useCallback(() => {
    if (!streamRef.current) return
    chunksRef.current = []
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4'

    const recorder = new MediaRecorder(streamRef.current, { mimeType })
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
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
  }, [])

  const stopRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop()
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null }
    setRecording(false)
  }, [])

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
      const fileName = `${Date.now()}-${authorName.replace(/\s+/g, '-')}.webm`
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
            Merci {authorName} ! Votre message sera diffusé lors de la fête.
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
          <p className="text-text-muted text-sm font-sans">Pour Maman avec amour</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <label className="block text-sm font-medium text-text-dark mb-2 font-sans">
          Votre prénom <span className="text-primary">*</span>
        </label>
        <Input placeholder="Entrez votre prénom" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
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
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-video card-shadow">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
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
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #B87A6A 0%, #9A5E4E 100%)' }}
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
          </motion.div>
        )}

        {step === 'preview' && videoUrl && (
          <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            <div className="rounded-3xl overflow-hidden bg-black aspect-video card-shadow">
              <video ref={previewRef} src={videoUrl} controls playsInline className="w-full h-full object-cover" />
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
