'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, Clapperboard, Headphones, PenLine, Sparkles } from 'lucide-react'
import Image from 'next/image'
import CountdownTimer from '@/components/CountdownTimer'
import FeatureCard from '@/components/FeatureCard'
import LoadingScreen from '@/components/LoadingScreen'
import QuickRsvpModal from '@/components/QuickRsvpModal'

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

const memories = [
  {
    src: '/memories/maman-portrait-1.jpg',
    alt: 'Souvenir de Maman',
    label: 'Maman',
  },
  {
    src: '/memories/maman-portrait-2.jpg',
    alt: 'Portrait souvenir',
    label: 'Sourire',
  },
  {
    src: '/memories/maman-portrait-3.jpg',
    alt: 'Photo de famille',
    label: 'Famille',
  },
  {
    src: '/memories/maman-portrait-4.jpg',
    alt: 'Moment partagé',
    label: 'Amour',
  },
]

const covers = [
  { src: '/covers/cover-1.jpg', alt: 'Cover anniversaire 1' },
  { src: '/covers/cover-2.png', alt: 'Cover anniversaire 2' },
  { src: '/covers/cover-3.png', alt: 'Cover anniversaire 3' },
]

export default function HomePage() {
  const [quickRsvpOpen, setQuickRsvpOpen] = useState(false)

  return (
    <>
      <LoadingScreen />
      <QuickRsvpModal open={quickRsvpOpen} onClose={() => setQuickRsvpOpen(false)} />

      <div className="min-h-screen px-5 pt-12 pb-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-4xl overflow-hidden mb-7 min-h-[560px] flex items-end card-shadow"
        >
          <Image
            src={covers[0].src}
            alt="Maman entourée de souvenirs"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 430px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/28 to-[#1E1812]/88" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#1E1812] to-transparent" />

          <div className="absolute left-4 top-4 right-4 z-10 flex items-start justify-between gap-3">
            <div className="rounded-full bg-white/18 px-3 py-1.5 backdrop-blur-md">
              <span className="text-white/90 text-[11px] font-semibold uppercase tracking-widest font-sans">
                Anniversaire
              </span>
            </div>
            <div className="rounded-full bg-white/18 px-3 py-1.5 backdrop-blur-md">
              <span className="text-white/90 text-[11px] font-semibold uppercase tracking-widest font-sans">
                30 Août
              </span>
            </div>
          </div>

          <div className="absolute right-4 top-16 z-10 flex flex-col gap-2">
            {covers.slice(1).map((cover, index) => (
              <motion.div
                key={cover.src}
                initial={{ opacity: 0, x: 22, rotate: 4 }}
                animate={{ opacity: 1, x: 0, rotate: index === 0 ? 3 : -3 }}
                transition={{ delay: 0.45 + index * 0.12, type: 'spring', stiffness: 220, damping: 20 }}
                className="relative h-24 w-16 overflow-hidden rounded-2xl border border-white/45 shadow-card"
              >
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 px-6 pt-32 pb-8 text-center w-full">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="inline-flex items-center gap-2 bg-white/14 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5"
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
              className="text-6xl font-light text-white mb-2 tracking-tight font-display"
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
              className="text-white/78 text-base font-light leading-relaxed font-sans"
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
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.45 }}
                className="mt-5 rounded-3xl bg-white/95 p-3.5 shadow-card backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-primary font-sans">
                      RSVP rapide
                    </p>
                    <p className="text-sm font-semibold text-text-dark font-sans">
                      Confirmez en 10 secondes
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setQuickRsvpOpen(true)}
                    className="h-12 flex-shrink-0 rounded-full bg-text-dark px-4 text-sm font-semibold text-white font-sans"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarCheck size={16} />
                      RSVP
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-7 pt-5 border-t border-white/10"
            >
              <p className="text-white/55 text-sm italic font-light leading-relaxed font-display">
                &ldquo;Une soirée pleine de souvenirs, de musique et d&apos;amour.&rdquo;
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Memories */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-end justify-between gap-4 mb-3">
            <div>
              <h2 className="text-2xl font-light text-text-dark font-display">
                Souvenirs
              </h2>
              <p className="text-text-muted text-sm mt-1 font-sans">
                Quelques images pour ouvrir la fête
              </p>
            </div>
            <span className="text-xs text-text-muted font-sans">{memories.length} photos</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
            {memories.map((memory, index) => (
              <motion.figure
                key={memory.src}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.08 }}
                className="relative h-48 w-36 flex-shrink-0 overflow-hidden rounded-3xl card-shadow bg-white/60"
              >
                <Image
                  src={memory.src}
                  alt={memory.alt}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
                  <figcaption className="text-white text-xs font-semibold font-sans">
                    {memory.label}
                  </figcaption>
                </div>
              </motion.figure>
            ))}
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
            <img src="/arrow-icon.png" width={13} height={13} alt="" aria-hidden />
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
