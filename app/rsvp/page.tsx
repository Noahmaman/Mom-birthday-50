'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Minus, Plus, Check, X, HelpCircle, type LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ConfettiAnimation from '@/components/ConfettiAnimation'

type AttendingOption = 'yes' | 'no' | 'maybe'

const attendingOptions: {
  value: AttendingOption
  label: string
  Icon: LucideIcon
  gradient: string
  iconColor: string
}[] = [
  {
    value: 'yes',
    label: 'Oui',
    Icon: Check,
    gradient: 'linear-gradient(135deg, #E6EFEC 0%, #D0E4DD 100%)',
    iconColor: '#6A9A8A',
  },
  {
    value: 'no',
    label: 'Non',
    Icon: X,
    gradient: 'linear-gradient(135deg, #F5E8E8 0%, #EDD0D0 100%)',
    iconColor: '#B87A6A',
  },
  {
    value: 'maybe',
    label: 'Peut-être',
    Icon: HelpCircle,
    gradient: 'linear-gradient(135deg, #F0EBE2 0%, #E4D8C0 100%)',
    iconColor: '#B8965A',
  },
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
    if (!name.trim()) { setError('Veuillez entrer votre nom'); return }
    if (!attending) { setError('Veuillez indiquer votre présence'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, guests_count: guestsCount, attending, allergies, comment }),
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
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
        <ConfettiAnimation />
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="glass-card rounded-4xl p-8 max-w-sm w-full text-center card-shadow"
          style={{ background: 'linear-gradient(135deg, #F2ECE6 0%, #EAE6F0 100%)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #B87A6A 0%, #7A6B9A 100%)' }}
          >
            <Check size={34} className="text-white" strokeWidth={2.5} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-light text-text-dark mb-2 font-display">Merci</h2>
            <p className="text-text-muted leading-relaxed font-sans text-sm">
              Votre RSVP a bien été enregistré.
              <br />
              On a hâte de vous voir !
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6">
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
          <h1 className="text-2xl font-light text-text-dark font-display">Votre présence</h1>
          <p className="text-text-muted text-sm font-sans">30 Août 2026</p>
        </div>
      </motion.div>

      <div className="space-y-5">
        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="block text-sm font-medium text-text-dark mb-2 font-sans">
            Nom complet <span className="text-primary">*</span>
          </label>
          <Input placeholder="Votre nom et prénom" value={name} onChange={(e) => setName(e.target.value)} />
        </motion.div>

        {/* Guests count */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-4 card-shadow"
        >
          <label className="block text-sm font-medium text-text-dark mb-3 font-sans">
            Nombre d&apos;invités
          </label>
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-sm font-sans">Vous + vos accompagnants</span>
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F2ECE6 0%, #E8D8D0 100%)' }}
              >
                <Minus size={15} className="text-text-dark" />
              </motion.button>
              <motion.span
                key={guestsCount}
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                className="text-2xl font-semibold text-text-dark w-8 text-center tabular-nums font-sans"
              >
                {guestsCount}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setGuestsCount(Math.min(20, guestsCount + 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E6EFEC 0%, #D0E4DD 100%)' }}
              >
                <Plus size={15} className="text-text-dark" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Attending */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium text-text-dark mb-3 font-sans">
            Serez-vous là ? <span className="text-primary">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {attendingOptions.map((opt) => {
              const Icon = opt.Icon
              return (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setAttending(opt.value)}
                  className={`rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-all duration-200 ${
                    attending === opt.value ? 'ring-2 ring-text-dark/20' : ''
                  }`}
                  style={{ background: attending === opt.value ? opt.gradient : 'rgba(255,252,248,0.6)' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: attending === opt.value ? 'rgba(255,255,255,0.5)' : 'rgba(255,252,248,0.8)' }}
                  >
                    <Icon size={18} strokeWidth={2} style={{ color: opt.iconColor }} />
                  </div>
                  <span className="text-xs font-semibold text-text-dark font-sans">{opt.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Allergies */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <label className="block text-sm font-medium text-text-dark mb-2 font-sans">
            Allergies alimentaires
            <span className="text-text-muted font-normal ml-2">(optionnel)</span>
          </label>
          <Textarea placeholder="Ex: sans gluten, végétarien..." rows={3} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </motion.div>

        {/* Comment */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <label className="block text-sm font-medium text-text-dark mb-2 font-sans">
            Un mot
            <span className="text-text-muted font-normal ml-2">(optionnel)</span>
          </label>
          <Textarea placeholder="Un message pour Maman..." rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl px-4 py-3 text-sm text-red-600 font-medium font-sans"
              style={{ background: 'rgba(245, 220, 220, 0.5)' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="pt-2">
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
              'Confirmer ma présence'
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
