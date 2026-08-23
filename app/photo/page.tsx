'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check, ChevronLeft, ImagePlus, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'

type Step = 'select' | 'uploading' | 'success'

type SelectedPhoto = {
  file: File
  previewUrl: string
}

const MAX_PHOTOS = 10
const MAX_PHOTO_SIZE = 10 * 1024 * 1024

function getPhotoExtension(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif', 'avif'].includes(extension)) {
    return extension
  }

  const mimeExtensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heif',
  }

  return mimeExtensions[file.type] || 'jpg'
}

export default function PhotoPage() {
  const router = useRouter()
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [authorName, setAuthorName] = useState('')
  const [photos, setPhotos] = useState<SelectedPhoto[]>([])
  const [step, setStep] = useState<Step>('select')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return

    const availableSlots = MAX_PHOTOS - photos.length
    const candidates = Array.from(files).slice(0, availableSlots)
    const invalidType = candidates.find((file) => !file.type.startsWith('image/'))
    const oversized = candidates.find((file) => file.size > MAX_PHOTO_SIZE)

    if (invalidType) {
      setError(`${invalidType.name} n'est pas une image.`)
      return
    }
    if (oversized) {
      setError(`${oversized.name} dépasse 10 Mo. Choisissez une photo plus légère.`)
      return
    }
    if (availableSlots <= 0) {
      setError(`Vous pouvez envoyer jusqu'à ${MAX_PHOTOS} photos à la fois.`)
      return
    }

    setError(files.length > availableSlots ? `Les ${MAX_PHOTOS} premières photos ont été sélectionnées.` : null)
    setPhotos((current) => [
      ...current,
      ...candidates.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ])
  }

  const removePhoto = (index: number) => {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].previewUrl)
      return current.filter((_, photoIndex) => photoIndex !== index)
    })
    setError(null)
  }

  const submitPhotos = async () => {
    if (!authorName.trim()) {
      setError('Entrez votre prénom avant de continuer.')
      return
    }
    if (photos.length === 0) {
      setError('Ajoutez au moins une photo.')
      return
    }

    setStep('uploading')
    setProgress(0)
    setError(null)

    try {
      const cleanName = authorName.trim().replace(/[^\w-]+/g, '-').replace(/-+/g, '-') || 'invite'

      for (let index = 0; index < photos.length; index += 1) {
        const photo = photos[index]
        const fileName = `${Date.now()}-${index}-${cleanName}.${getPhotoExtension(photo.file)}`
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, photo.file, {
            contentType: photo.file.type || 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName)
        const response = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author_name: authorName, url: urlData.publicUrl }),
        })

        if (!response.ok) {
          const details = await response.json().catch(() => null)
          throw new Error(details?.error || "L'enregistrement de la photo a échoué")
        }

        setProgress(Math.round(((index + 1) / photos.length) * 100))
      }

      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
      setStep('success')
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : ''
      setError(message.includes('row-level security')
        ? "L'envoi est temporairement bloqué. Prévenez l'organisateur."
        : `Les photos n'ont pas pu être envoyées. Vérifiez la connexion puis réessayez.${message ? ` (${message})` : ''}`)
      setStep('select')
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-sm rounded-4xl p-8 text-center card-shadow"
          style={{ background: 'linear-gradient(135deg, #E6EFEC 0%, #F0EBE2 100%)' }}
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-accent-sage">
            <Check size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-light text-text-dark font-display">Photos envoyées</h1>
          <p className="mt-2 text-sm leading-relaxed text-text-muted font-sans">
            Merci {authorName} ! {photos.length > 1 ? `Vos ${photos.length} photos sont bien enregistrées.` : 'Votre photo est bien enregistrée.'}
          </p>
          <Button className="mt-6 w-full" onClick={() => router.push('/')}>Retour à l&apos;accueil</Button>
        </motion.div>
      </div>
    )
  }

  if (step === 'uploading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="glass-card w-full max-w-sm rounded-4xl p-8 text-center card-shadow">
          <Loader2 size={44} className="mx-auto mb-5 animate-spin text-accent-sage" strokeWidth={1.5} />
          <h1 className="text-2xl font-light text-text-dark font-display">Envoi des photos</h1>
          <p className="mb-6 mt-1 text-sm text-text-muted">Ne fermez pas cette page</p>
          <Progress value={progress} />
          <p className="mt-2 text-xs text-text-muted">{progress}%</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-5 pb-8 pt-14">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="glass-card flex h-10 w-10 items-center justify-center rounded-full card-shadow" aria-label="Retour">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-light text-text-dark font-display">Photos souvenirs</h1>
          <p className="text-sm text-text-muted">Partagez vos plus beaux moments</p>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 overflow-hidden rounded-4xl p-6 card-shadow"
        style={{ background: 'linear-gradient(135deg, #DCECE6 0%, #F0EBE2 55%, #E8D8D0 100%)' }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-sage">
              <Sparkles size={12} /> Album de Yael
            </div>
            <h2 className="text-3xl font-light leading-tight text-text-dark font-display">Ajoutez vos photos ici</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-muted">Prises maintenant ou choisies depuis votre galerie. Elles seront toutes disponibles dans l&apos;album privé.</p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70">
            <ImagePlus size={27} className="text-accent-sage" />
          </div>
        </div>

        <label className="mb-2 block text-sm font-semibold text-text-dark">Votre prénom</label>
        <Input value={authorName} onChange={(event) => setAuthorName(event.target.value)} placeholder="Entrez votre prénom" />
      </motion.section>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => cameraInputRef.current?.click()}
          className="rounded-3xl bg-text-dark p-5 text-left text-white card-shadow"
        >
          <Camera size={28} className="mb-4" />
          <p className="font-semibold">Prendre une photo</p>
          <p className="mt-1 text-xs text-white/65">Ouvrir l&apos;appareil</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => galleryInputRef.current?.click()}
          className="rounded-3xl bg-[#EAE6F0] p-5 text-left text-text-dark card-shadow"
        >
          <ImagePlus size={28} className="mb-4 text-secondary" />
          <p className="font-semibold">Choisir des photos</p>
          <p className="mt-1 text-xs text-text-muted">Jusqu&apos;à {MAX_PHOTOS} images</p>
        </motion.button>
      </div>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} />
      <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} />

      {photos.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-text-dark">{photos.length} photo{photos.length > 1 ? 's' : ''} prête{photos.length > 1 ? 's' : ''}</h2>
            {photos.length < MAX_PHOTOS && (
              <button onClick={() => galleryInputRef.current?.click()} className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                <Plus size={14} /> Ajouter
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div key={`${photo.file.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-white card-shadow">
                <img src={photo.previewUrl} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
                <button onClick={() => removePhoto(index)} className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white" aria-label={`Supprimer la photo ${index + 1}`}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-600">{error}</p>}

      <Button className="mt-5 w-full min-h-14 text-base" onClick={submitPhotos} disabled={!authorName.trim() || photos.length === 0}>
        <ImagePlus size={19} className="mr-2" />
        Envoyer {photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? 's' : ''}` : 'les photos'}
      </Button>
    </div>
  )
}
