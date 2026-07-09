'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function LoadingScreen() {
  const [show, setShow] = useState(false)
  const [exit, setExit] = useState(false)

  useEffect(() => {
    const hasShown = sessionStorage.getItem('loading-shown')
    if (!hasShown) {
      setShow(true)
      sessionStorage.setItem('loading-shown', 'true')
      const timer = setTimeout(() => setExit(true), 2400)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && !exit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-end overflow-hidden bg-[#1E1812]"
        >
          <Image
            src="/covers/cover-4.png"
            alt="Cover d'accueil anniversaire"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/8 to-[#1E1812]/82" />

          <div className="relative z-10 flex w-full flex-col items-center gap-5 px-8 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/65 font-sans">
                30 Août 2026
              </p>
              <h1 className="text-5xl font-light text-white tracking-tight font-display">
                Maman
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-8 h-px bg-white/40 mx-auto mt-2"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-white/72 text-sm mt-3 font-light font-sans tracking-wide"
              >
                La fête se prépare...
              </motion.p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/50"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.22 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
