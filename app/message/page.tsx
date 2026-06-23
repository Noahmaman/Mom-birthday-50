'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
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
    if (!authorName.trim()) {
      setError('Veuillez entrer votre nom')
      return
    }
    if (!content.trim()) {
      setError('Veuillez écrire un message')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: authorName, content }),
      })

      if (!res.ok) throw new Error('Erreur lors de l\'envoi')

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
          style={{ background: 'linear-gradient(135deg, #FFF8E4 0%, #EDE4F9 100%)' }}
        >
          {/* Animated hearts */}
          <div className="relative w-24 h-24 mx-auto mb-5">
            <motion.div
              animate={{
                scale: [1, 1.3, 1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl text-center absolute inset-0 flex items-center justify-center"
            >
              ❤️
            </motion.div>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  x: [0, (i % 2 === 0 ? 1 : -1) * 30],
                  y: [0, -40],
                }}
                transition={{ delay: i * 0.3, duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center text-2xl"
              >
                💕
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-text-dark mb-2">
              Votre message a été envoyé !
            </h2>
            <p className="text-text-muted leading-relaxed">
              Maman recevra votre message avec tout l&apos;amour qu&apos;il contient ❤️
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Button
              variant="primary"
              className="w-full"
              onClick={() => router.push('/')}
            >
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
          <h1 className="text-2xl font-bold text-text-dark">Un mot pour Maman</h1>
          <p className="text-text-muted text-sm">Exprimez vos sentiments 💌</p>
        </div>
      </motion.div>

      {/* Decorative card header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 mb-6 card-shadow"
        style={{ background: 'linear-gradient(135deg, #FFF8E4 0%, #EDE4F9 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="text-4xl">💌</div>
          <div>
            <p className="font-semibold text-text-dark">Carte de vœux virtuelle</p>
            <p className="text-text-muted text-sm">
              Votre message sera affiché lors de la fête
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-5">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Votre nom <span className="text-primary-pink-dark">*</span>
          </label>
          <Input
            placeholder="Votre prénom ou pseudo"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </motion.div>

        {/* Message content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-text-dark">
              Votre message <span className="text-primary-pink-dark">*</span>
            </label>
            <span
              className={`text-xs font-medium transition-colors ${
                content.length > MAX_CHARS * 0.9
                  ? 'text-red-500'
                  : 'text-text-muted'
              }`}
            >
              {content.length}/{MAX_CHARS}
            </span>
          </div>
          <Textarea
            placeholder="Chère Maman, je voulais te dire..."
            rows={8}
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setContent(e.target.value)
              }
            }}
            className="text-base leading-relaxed"
          />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl px-4 py-3 text-sm text-red-600 font-medium"
              style={{ background: 'rgba(255,200,200,0.5)' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            className="w-full h-14 text-base rounded-3xl"
            onClick={handleSubmit}
            disabled={loading}
          >
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
              'Envoyer mon message 💌'
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
