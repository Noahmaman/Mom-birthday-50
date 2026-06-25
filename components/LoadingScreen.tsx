'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(160deg, #1E1812 0%, #4A2E24 55%, #B87A6A 100%)' }}
        >
          {/* Subtle background texture */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/5"
                style={{
                  width: 120 + i * 60,
                  height: 120 + i * 60,
                  left: `${[10, 70, 20, 60][i]}%`,
                  top: `${[20, 10, 65, 60][i]}%`,
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center gap-7">
            {/* Animated Heart icon */}
            <motion.div
              animate={{ scale: [1, 1.18, 1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"
            >
              <Heart size={32} className="text-white" fill="rgba(255,255,255,0.9)" strokeWidth={1.5} />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl font-light text-white tracking-tight font-display">
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
                className="text-white/50 text-sm mt-3 font-light font-sans tracking-wide"
              >
                30 Août 2026
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
