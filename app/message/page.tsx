'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, PenLine, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const MAX_CHARS = 500

export default function MessagePage() {
  const router = useRouter()
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!authorName.trim()) { setError('Veuillez entrer votre nom'); return }
    if (!content.trim()) { setError('Veuillez écrire un message'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: authorName, content }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="glass-card rounded-4xl p-8 max-w-sm w-full text-center card-shadow"
          style={{ background: 'linear-gradient(135deg, #F0EBE2 0%, #EAE6F0 100%)' }}
        >
          {/* Pulsing heart icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #B87A6A 0%, #7A6B9A 100%)' }}
          >
            <Heart size={32} className="text-white" fill="white" strokeWidth={1.5} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-3xl font-light text-text-dark mb-2 font-display">
              Message envoyé
            </h2>
            <p className="text-text-muted leading-relaxed font-sans text-sm">
              Maman recevra votre message avec tout l&apos;amour qu&apos;il contient.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
            <Button className="w-full" onClick={() => router.push('/')}>
              Retour à l&apos;accueil
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-5 pt-14 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 glass-card rounded-full flex items-center justify-center card-shadow"
        >
          <ChevronLeft size={20} className="text-text-dark" />
        </button>
        <div>
          <h1 className="text-2xl font-light text-text-dark font-display">Un mot pour Maman</h1>
          <p className="text-text-muted text-sm font-sans">Carte de vœux virtuelle</p>
        </div>
      </motion.div>

      {/* Decorative header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 mb-6 card-shadow flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #F0EBE2 0%, #EAE6F0 100%)' }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.6)' }}
        >
          <PenLine size={22} strokeWidth={1.6} className="text-accent-gold" />
        </div>
        <div>
          <p className="font-medium text-text-dark text-sm font-sans">Carte de vœux virtuelle</p>
          <p className="text-text-muted text-xs font-sans mt-0.5">
            Votre message sera affiché lors de la fête
          </p>
        </div>
      </motion.div>

      <div className="space-y-5">
        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className="block text-sm font-medium text-text-dark mb-2 font-sans">
            Votre nom <span className="text-primary">*</span>
          </label>
          <Input placeholder="Votre prénom ou pseudo" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-text-dark font-sans">
              Votre message <span className="text-primary">*</span>
            </label>
            <span className={`text-xs font-medium transition-colors font-sans ${content.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-text-muted'}`}>
              {content.length}/{MAX_CHARS}
            </span>
          </div>
          <Textarea
            placeholder="Chère Maman, je voulais te dire..."
            rows={8}
            value={content}
            onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setContent(e.target.value) }}
            className="text-base leading-relaxed font-display"
          />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl px-4 py-3 text-sm text-red-600 font-medium font-sans"
              style={{ background: 'rgba(245,220,220,0.5)' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button className="w-full h-14 text-base rounded-3xl font-sans" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Envoi en cours...
              </div>
            ) : (
              'Envoyer mon message'
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
