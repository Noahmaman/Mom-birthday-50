'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, HelpCircle, Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type AttendingOption = 'yes' | 'no' | 'maybe'

const options: { value: AttendingOption; label: string; Icon: typeof Check; color: string }[] = [
  { value: 'yes', label: 'Oui', Icon: Check, color: '#6A9A8A' },
  { value: 'maybe', label: 'Peut-être', Icon: HelpCircle, color: '#B8965A' },
  { value: 'no', label: 'Non', Icon: X, color: '#B87A6A' },
]

const kissOptions = [
  'Bisous',
  'Gros bisous',
  'Mille bisous',
  'Bisous doux',
  'Bisous tendres',
  'Bisous d’amour',
  'Plein de bisous',
  'Énormes bisous',
  'Bisous câlins',
  'Bisous soleil',
  'Bisous sucrés',
  'Bisous magiques',
  'Bisous de loin',
  'Bisous du cœur',
  'Bisous infinis',
  'Bisous joyeux',
  'Bisous étoilés',
  'Bisous pétillants',
  'Bisous fleuris',
  'Bisous dorés',
  'Bisous chaleureux',
  'Bisous maman',
  'Bisous famille',
  'Bisous bonheur',
  'Bisous surprise',
  'Bisous de fête',
  'Bisous éternels',
  'Bisous lumineux',
  'Bisous tout doux',
  'Je t’embrasse fort',
]

export default function QuickRsvpModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [guestsCount, setGuestsCount] = useState(1)
  const [attending, setAttending] = useState<AttendingOption>('yes')
  const [foodPreferences, setFoodPreferences] = useState('')
  const [selectedKiss, setSelectedKiss] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetAndClose = () => {
    setSuccess(false)
    setError(null)
    setSelectedKiss(null)
    onClose()
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Ajoutez votre prénom.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          guests_count: guestsCount,
          attending,
          allergies: foodPreferences.trim(),
          comment: [
            'RSVP express depuis l’accueil',
            selectedKiss ? `Bisous choisi: ${selectedKiss}` : null,
          ].filter(Boolean).join(' · '),
        }),
      })

      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setError("Impossible d'enregistrer pour le moment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/45 px-4 pb-4 pt-10 backdrop-blur-sm sm:items-center"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-4xl bg-[#FFFCF8] p-5 card-shadow no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary font-sans">
                  RSVP express
                </p>
                <h2 className="mt-1 text-3xl font-light text-text-dark font-display">
                  Vous venez ?
                </h2>
                <p className="mt-1 text-sm text-text-muted font-sans">
                  Réponse rapide pour la fête de Maman.
                </p>
              </div>
              <button
                onClick={resetAndClose}
                className="h-10 w-10 flex-shrink-0 rounded-full bg-[#F2ECE6] flex items-center justify-center"
                aria-label="Fermer"
              >
                <X size={17} className="text-text-dark" />
              </button>
            </div>

            {success ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-sage/18">
                  <Check size={28} className="text-accent-sage" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-light text-text-dark font-display">C’est noté</h3>
                <p className="mt-2 text-sm text-text-muted font-sans">
                  Merci {name.trim()}, votre RSVP est enregistré.
                </p>
                <Button className="mt-6 w-full rounded-3xl" onClick={resetAndClose}>
                  Parfait
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-dark font-sans">
                    Votre prénom <span className="text-primary">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prénom"
                    autoFocus
                  />
                </div>

                <div className="rounded-3xl bg-[#F6F1EB] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-dark font-sans">Nombre d’invités</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                        className="h-9 w-9 rounded-full bg-white flex items-center justify-center"
                        aria-label="Retirer un invité"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-7 text-center text-xl font-semibold tabular-nums text-text-dark font-sans">
                        {guestsCount}
                      </span>
                      <button
                        onClick={() => setGuestsCount(Math.min(20, guestsCount + 1))}
                        className="h-9 w-9 rounded-full bg-white flex items-center justify-center"
                        aria-label="Ajouter un invité"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {options.map((option) => {
                    const Icon = option.Icon
                    const selected = attending === option.value
                    return (
                      <button
                        key={option.value}
                        onClick={() => setAttending(option.value)}
                        className={`min-h-24 rounded-3xl border p-3 transition ${
                          selected ? 'border-text-dark/15 bg-[#F2ECE6]' : 'border-transparent bg-[#F6F1EB]'
                        }`}
                      >
                        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-white">
                          <Icon size={17} style={{ color: option.color }} />
                        </div>
                        <span className="text-xs font-semibold text-text-dark font-sans">{option.label}</span>
                      </button>
                    )
                  })}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-dark font-sans">
                    Préférences alimentaires
                    <span className="ml-2 text-text-muted font-normal">(optionnel)</span>
                  </label>
                  <Textarea
                    value={foodPreferences}
                    onChange={(e) => setFoodPreferences(e.target.value)}
                    placeholder="Végétarien, cacher, allergie, sans gluten..."
                    rows={3}
                    className="bg-white/80"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-text-dark font-sans">
                        30 manières de dire bisous
                      </p>
                      <p className="text-xs text-text-muted font-sans">
                        Choisissez-en une, rien n’est sélectionné par défaut.
                      </p>
                    </div>
                    {selectedKiss && (
                      <button
                        onClick={() => setSelectedKiss(null)}
                        className="text-xs font-semibold text-primary font-sans"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                  <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-3xl bg-[#F6F1EB] p-3 no-scrollbar">
                    {kissOptions.map((kiss) => {
                      const selected = selectedKiss === kiss
                      return (
                        <button
                          key={kiss}
                          onClick={() => setSelectedKiss(selected ? null : kiss)}
                          className={`rounded-full px-3 py-2 text-xs font-semibold transition font-sans ${
                            selected
                              ? 'bg-text-dark text-white'
                              : 'bg-white text-text-dark'
                          }`}
                        >
                          {kiss}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {error && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 font-sans">
                    {error}
                  </p>
                )}

                <Button className="h-14 w-full rounded-3xl text-base" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Confirmer maintenant'}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
