'use client'

import { motion } from 'framer-motion'
import CountdownTimer from '@/components/CountdownTimer'
import FeatureCard from '@/components/FeatureCard'
import LoadingScreen from '@/components/LoadingScreen'
import { Sparkles } from 'lucide-react'

const cards = [
  {
    emoji: '🎉',
    title: 'RSVP',
    subtitle: 'Confirmez votre présence',
    href: '/rsvp',
    gradient: 'linear-gradient(135deg, #FFE4E8 0%, #F9C6D0 100%)',
  },
  {
    emoji: '🎥',
    title: 'Laisser une vidéo',
    subtitle: 'Un message en vidéo pour Maman',
    href: '/video',
    gradient: 'linear-gradient(135deg, #EDE4F9 0%, #D9C6F0 100%)',
  },
  {
    emoji: '🎵',
    title: 'Playlist',
    subtitle: 'Ajoutez vos chansons préférées',
    href: '/playlist',
    gradient: 'linear-gradient(135deg, #E4F9EE 0%, #C6F0DA 100%)',
  },
  {
    emoji: '💌',
    title: 'Laisser un message',
    subtitle: 'Écrivez vos mots doux à Maman',
    href: '/message',
    gradient: 'linear-gradient(135deg, #FFF8E4 0%, #FFF0C6 100%)',
  },
]

export default function HomePage() {
  return (
    <>
      <LoadingScreen />

      <div className="min-h-screen px-5 pt-12 pb-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-4xl overflow-hidden mb-8"
          style={{
            background: 'linear-gradient(135deg, #F4A7B9 0%, #C9A7E8 50%, #A7C7E7 100%)',
            backgroundSize: '200% 200%',
          }}
        >
          {/* Animated background blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10"
            />
          </div>

          <div className="relative z-10 px-6 pt-10 pb-8 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5"
            >
              <Sparkles size={14} className="text-white" />
              <span className="text-white text-xs font-semibold tracking-wide uppercase">
                30 Août 2026
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl font-bold text-white mb-3 drop-shadow-sm tracking-tight"
            >
              Maman ❤️
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/85 text-lg font-light leading-relaxed"
            >
              Célébrons ensemble
              <br />
              ce jour spécial
            </motion.p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-7"
            >
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-3">
                Compte à rebours
              </p>
              <CountdownTimer />
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-7 pt-5 border-t border-white/20"
            >
              <p className="text-white/80 text-sm italic font-light leading-relaxed">
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
          className="mb-4"
        >
          <h2 className="text-xl font-bold text-text-dark">
            Participer à la fête
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Tout est préparé avec amour 💕
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          {cards.map((card, i) => (
            <FeatureCard
              key={card.href}
              {...card}
              delay={0.6 + i * 0.1}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center py-4"
        >
          <p className="text-text-muted text-xs">
            Fait avec ❤️ pour Maman
          </p>
        </motion.div>
      </div>
    </>
  )
}
