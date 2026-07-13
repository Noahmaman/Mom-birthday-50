'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ExternalLink, Gift, HeartHandshake } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const leetchiUrl = 'https://www.leetchi.com/fr/c/50-ans-yael-2106387'

export default function CagnottePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen px-5 pt-14 pb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="w-10 h-10 glass-card rounded-full flex items-center justify-center card-shadow">
          <ChevronLeft size={20} className="text-text-dark" />
        </button>
        <div>
          <h1 className="text-2xl font-light text-text-dark font-display">Cagnotte</h1>
          <p className="text-text-muted text-sm font-sans">Pour le cadeau de Yael</p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-4xl p-6 card-shadow"
        style={{ background: 'linear-gradient(135deg, #F6F1EB 0%, #E6EFEC 100%)' }}
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/75">
          <Gift size={30} className="text-accent-sage" strokeWidth={1.7} />
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary font-sans">
          50 ans de Yael
        </p>
        <h2 className="mt-2 text-4xl font-light leading-tight text-text-dark font-display">
          Participer à la cagnotte
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-muted font-sans">
          Pour celles et ceux qui souhaitent participer au cadeau commun, la cagnotte Leetchi est disponible ici.
          La participation est libre.
        </p>

        <a href={leetchiUrl} target="_blank" rel="noopener noreferrer" className="mt-7 block">
          <Button className="h-14 w-full rounded-2xl font-sans text-base">
            <Gift size={18} className="mr-2" />
            Ouvrir la cagnotte
            <ExternalLink size={16} className="ml-2" />
          </Button>
        </a>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 rounded-3xl bg-white/70 p-5 card-shadow"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F0EBE2]">
            <HeartHandshake size={20} className="text-accent-gold" strokeWidth={1.7} />
          </span>
          <div>
            <p className="font-semibold text-text-dark font-sans">Merci pour elle</p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted font-sans">
              Le cadeau sera préparé avec les participations reçues avant l’anniversaire.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
