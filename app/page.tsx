'use client'

import { motion } from 'framer-motion'
import { CalendarCheck, Clapperboard, Headphones, PenLine, Sparkles } from 'lucide-react'
import CountdownTimer from '@/components/CountdownTimer'
import FeatureCard from '@/components/FeatureCard'
import LoadingScreen from '@/components/LoadingScreen'

const cards = [
  {
    Icon: CalendarCheck,
    title: 'RSVP',
    subtitle: 'Confirmez votre présence',
    href: '/rsvp',
    gradient: 'linear-gradient(135deg, #F2ECE6 0%, #E8D8D0 100%)',
    iconColor: '#B87A6A',
  },
  {
    Icon: Clapperboard,
    title: 'Message vidéo',
    subtitle: 'Un mot en vidéo pour Maman',
    href: '/video',
    gradient: 'linear-gradient(135deg, #EAE6F0 0%, #D8D0E8 100%)',
    iconColor: '#7A6B9A',
  },
  {
    Icon: Headphones,
    title: 'Playlist',
    subtitle: 'Ajoutez vos chansons',
    href: '/playlist',
    gradient: 'linear-gradient(135deg, #E6EFEC 0%, #D0E4DD 100%)',
    iconColor: '#6A9A8A',
  },
  {
    Icon: PenLine,
    title: 'Laisser un mot',
    subtitle: 'Vos mots doux pour Maman',
    href: '/message',
    gradient: 'linear-gradient(135deg, #F0EBE2 0%, #E4D8C0 100%)',
    iconColor: '#B8965A',
  },
]

export default function HomePage() {
  return (
    <>
      <LoadingScreen />

      <div className="min-h-screen px-5 pt-12 pb-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-4xl overflow-hidden mb-8"
          style={{ background: 'linear-gradient(160deg, #1E1812 0%, #4A2E24 55%, #B87A6A 100%)' }}
        >
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], rotate: [0, -90, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5"
            />
          </div>

          <div className="relative z-10 px-6 pt-10 pb-8 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5"
            >
              <Sparkles size={12} className="text-white/70" />
              <span className="text-white/80 text-xs font-medium tracking-widest uppercase font-sans">
                30 Août 2026
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl font-light text-white mb-2 tracking-tight font-display"
            >
              Maman
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-10 h-px bg-white/40 mx-auto mb-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-white/70 text-base font-light leading-relaxed font-sans"
            >
              Célébrons ensemble
              <br />
              ce jour si spécial
            </motion.p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8"
            >
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3 font-sans">
                Compte à rebours
              </p>
              <CountdownTimer />
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-7 pt-5 border-t border-white/10"
            >
              <p className="text-white/55 text-sm italic font-light leading-relaxed font-display">
                &ldquo;Nous avons hâte de célébrer ensemble.&rdquo;
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-5"
        >
          <h2 className="text-2xl font-light text-text-dark font-display">
            Participer à la fête
          </h2>
          <p className="text-text-muted text-sm mt-1 font-sans">
            Tout est préparé avec amour
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3.5 pb-6">
          {cards.map((card, i) => (
            <FeatureCard key={card.href} {...card} delay={0.6 + i * 0.08} />
          ))}
        </div>

        {/* Arrow AI footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center py-4 pb-2"
        >
          <a
            href="https://arrow-ai.us"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card"
          >
            <img src="/favicon-arrow.ico" width={13} height={13} alt="" aria-hidden />
            <span className="text-[10px] text-text-muted font-sans">Powered by</span>
            <span
              className="text-[10px] text-text-dark tracking-widest uppercase font-sans"
              style={{ fontWeight: 700 }}
            >
              Arrow AI
            </span>
          </a>
        </motion.div>
      </div>
    </>
  )
}
