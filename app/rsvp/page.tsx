'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Minus, Plus, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ConfettiAnimation from '@/components/ConfettiAnimation'

type AttendingOption = 'yes' | 'no' | 'maybe'

const attendingOptions: { value: AttendingOption; label: string; emoji: string; gradient: string }[] = [
  { value: 'yes', label: 'Oui !', emoji: '✅', gradient: 'linear-gradient(135deg, #A8E6CF 0%, #7FD9B0 100%)' },
  { value: 'no', label: 'Non', emoji: '❌', gradient: 'linear-gradient(135deg, #FFB3B3 0%, #FF8E8E 100%)' },
  { value: 'maybe', label: 'Peut-être', emoji: '🤔', gradient: 'linear-gradient(135deg, #FFE4A0 0%, #FFD570 100%)' },
]

export default function RsvpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [guestsCount, setGuestsCount] = useState(1)
  const [attending, setAttending] = useState<AttendingOption | null>(null)
  const [allergies, setAllergies] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Veuillez entrer votre nom')
      return
    }
    if (!attending) {
      setError('Veuillez indiquer votre présence')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, guests_count: guestsCount, attending, allergies, comment }),
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
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
        <ConfettiAnimation />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="glass-card rounded-4xl p-8 max-w-sm w-full text-center card-shadow"
          style={{ background: 'linear-gradient(135deg, #FFE4E8 0%, #EDE4F9 100%)' }}
        >
          {/* Animated check */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
            className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F4A7B9 0%, #C9A7E8 100%)' }}
          >
            <Check size={36} className="text-white" strokeWidth={3} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-text-dark mb-2">
              Merci ❤️
            </h2>
            <p className="text-text-muted leading-relaxed">
              Votre RSVP a bien été enregistré.
              <br />
              On a hâte de vous voir !
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex flex-col gap-3"
          >
            <Button
              variant="primary"
              className="w-full"
              onClick={() => router.push('/')}
            >
              Retour à l&apos;accueil
            </Button>
          </motion.div>

          {/* Floating hearts */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: -80,
                x: (i - 2) * 30,
              }}
              transition={{ delay: 0.5 + i * 0.15, duration: 1.5 }}
              className="absolute text-xl pointer-events-none"
              style={{ left: '50%', bottom: '30%' }}
            >
              ❤️
            </motion.div>
          ))}
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
          <h1 className="text-2xl font-bold text-text-dark">Votre présence</h1>
          <p className="text-text-muted text-sm">30 Août 2026</p>
        </div>
      </motion.div>

      <div className="space-y-5">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Nom complet <span className="text-primary-pink-dark">*</span>
          </label>
          <Input
            placeholder="Votre nom et prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </motion.div>

        {/* Guests count */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-4 card-shadow"
        >
          <label className="block text-sm font-semibold text-text-dark mb-3">
            Nombre d&apos;invités
          </label>
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-sm">
              Vous + vos accompagnants
            </span>
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FFE4E8 0%, #F9C6D0 100%)' }}
              >
                <Minus size={16} className="text-text-dark" />
              </motion.button>
              <motion.span
                key={guestsCount}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-text-dark w-8 text-center tabular-nums"
              >
                {guestsCount}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setGuestsCount(Math.min(20, guestsCount + 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #A8E6CF 0%, #7FD9B0 100%)' }}
              >
                <Plus size={16} className="text-text-dark" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Attending */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-text-dark mb-3">
            Serez-vous là ? <span className="text-primary-pink-dark">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {attendingOptions.map((opt) => (
              <motion.button
                key={opt.value}
                whileTap={{ scale: 0.93 }}
                onClick={() => setAttending(opt.value)}
                className={`rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                  attending === opt.value
                    ? 'ring-2 ring-text-dark shadow-card-hover'
                    : 'ring-0'
                }`}
                style={{
                  background: attending === opt.value ? opt.gradient : 'rgba(255,255,255,0.6)',
                }}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-sm font-semibold text-text-dark">
                  {opt.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Allergies */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Allergies alimentaires
            <span className="text-text-muted font-normal ml-2">(optionnel)</span>
          </label>
          <Textarea
            placeholder="Ex: sans gluten, végétarien..."
            rows={3}
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
          />
        </motion.div>

        {/* Comment */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Un mot
            <span className="text-text-muted font-normal ml-2">(optionnel)</span>
          </label>
          <Textarea
            placeholder="Un message pour Maman..."
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
          transition={{ delay: 0.35 }}
          className="pt-2"
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
              'Confirmer ma présence ❤️'
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
