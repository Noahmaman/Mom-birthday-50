'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Video, Upload, Circle, Square, Check, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'

type Step = 'choose' | 'record' | 'upload' | 'preview' | 'submitting' | 'success'

const MAX_DURATION = 90 // seconds

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
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setStep('record')
    } catch {
      setError('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès.')
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

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      setVideoBlob(blob)
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      setStep('preview')
      if (previewRef.current) {
        previewRef.current.src = url
      }
    }

    recorder.start(100)
    setRecording(true)
    setRecordingTime(0)

    timerRef.current = setInterval(() => {
      setRecordingTime((t) => {
        if (t >= MAX_DURATION - 1) {
          stopRecording()
          return MAX_DURATION
        }
        return t + 1
      })
    }, 1000)
  }, [])

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setRecording(false)
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime']
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setError('Format non supporté. Utilisez MP4, WebM ou MOV.')
      return
    }

    setVideoBlob(file)
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    setStep('preview')
  }

  const handleSubmit = async () => {
    if (!authorName.trim()) {
      setError('Veuillez entrer votre nom')
      return
    }
    if (!videoBlob) {
      setError('Aucune vidéo sélectionnée')
      return
    }

    setStep('submitting')
    setError(null)
    setUploadProgress(0)

    try {
      const fileName = `${Date.now()}-${authorName.replace(/\s+/g, '-')}.webm`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoBlob, {
          contentType: videoBlob.type || 'video/webm',
          upsert: false,
        })

      if (uploadError) throw uploadError

      setUploadProgress(80)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName)

      const publicUrl = urlData.publicUrl

      // Save to database via API
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: authorName, url: publicUrl }),
      })

      if (!res.ok) throw new Error('Erreur lors de l\'enregistrement')

      setUploadProgress(100)
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
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
          style={{ background: 'linear-gradient(135deg, #EDE4F9 0%, #FFF8E4 100%)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C9A7E8 0%, #F4A7B9 100%)' }}
          >
            <Check size={36} className="text-white" strokeWidth={3} />
          </motion.div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">
            Vidéo envoyée ! 🎉
          </h2>
          <p className="text-text-muted leading-relaxed">
            Merci {authorName} ! Votre message vidéo sera diffusé lors de la fête.
          </p>
          <Button
            variant="primary"
            className="w-full mt-6"
            onClick={() => router.push('/')}
          >
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
            className="text-5xl mb-4 inline-block"
          >
            🎥
          </motion.div>
          <h2 className="text-xl font-bold text-text-dark mb-2">
            Envoi en cours...
          </h2>
          <p className="text-text-muted text-sm mb-6">
            Veuillez patienter
          </p>
          <Progress value={uploadProgress} />
          <p className="text-text-muted text-xs mt-2">{uploadProgress}%</p>
        </motion.div>
      </div>
    )
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
          onClick={() => {
            stopRecording()
            router.back()
          }}
          className="w-10 h-10 glass-card rounded-full flex items-center justify-center card-shadow"
        >
          <ChevronLeft size={20} className="text-text-dark" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Message vidéo</h1>
          <p className="text-text-muted text-sm">Pour Maman avec amour 🎥</p>
        </div>
      </motion.div>

      {/* Author name */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5"
      >
        <label className="block text-sm font-semibold text-text-dark mb-2">
          Votre prénom <span className="text-primary-pink-dark">*</span>
        </label>
        <Input
          placeholder="Entrez votre prénom"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step: Choose */}
        {step === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Record option */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={startCamera}
              className="w-full rounded-3xl p-6 flex items-center gap-4 card-shadow text-left"
              style={{ background: 'linear-gradient(135deg, #EDE4F9 0%, #D9C6F0 100%)' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0">
                <Video size={28} className="text-accent-purple" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-bold text-text-dark text-lg">Enregistrer une vidéo</p>
                <p className="text-text-muted text-sm mt-1">
                  Utilisez votre caméra · Max {MAX_DURATION}s
                </p>
              </div>
            </motion.button>

            {/* Upload option */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-3xl p-6 flex items-center gap-4 card-shadow text-left"
              style={{ background: 'linear-gradient(135deg, #FFF8E4 0%, #FFE4B0 100%)' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0">
                <Upload size={28} className="text-soft-yellow" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-bold text-text-dark text-lg">Télécharger une vidéo</p>
                <p className="text-text-muted text-sm mt-1">
                  Depuis votre galerie · MP4, WebM, MOV
                </p>
              </div>
            </motion.button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {error && (
              <p className="text-red-500 text-sm font-medium px-1">{error}</p>
            )}
          </motion.div>
        )}

        {/* Step: Record */}
        {step === 'record' && (
          <motion.div
            key="record"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-video card-shadow">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Recording indicator */}
              {recording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-red-500"
                  />
                  <span className="text-white text-sm font-medium">
                    {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:
                    {String(recordingTime % 60).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Max time indicator */}
              {recording && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                  <motion.div
                    className="h-full bg-red-500"
                    style={{ width: `${(recordingTime / MAX_DURATION) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-6">
              {!recording ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F4A7B9 0%, #E8849A 100%)' }}
                >
                  <Circle size={32} className="text-white" fill="white" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)' }}
                >
                  <Square size={28} className="text-white" fill="white" />
                </motion.button>
              )}
            </div>

            <p className="text-center text-text-muted text-sm">
              {recording
                ? `Enregistrement... Max ${MAX_DURATION - recordingTime}s restantes`
                : 'Appuyez sur le bouton pour démarrer'}
            </p>
          </motion.div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && videoUrl && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="rounded-3xl overflow-hidden bg-black aspect-video card-shadow">
              <video
                ref={previewRef}
                src={videoUrl}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="glass-card rounded-2xl p-4 card-shadow">
              <p className="text-text-muted text-sm text-center">
                ✅ Votre vidéo est prête à être envoyée
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium px-1">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleRetake}
              >
                <RotateCcw size={16} className="mr-2" />
                Recommencer
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!authorName.trim()}
              >
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
