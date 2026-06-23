'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

export default function MusicToggle() {
  const [muted, setMuted] = useState(true)

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setMuted(!muted)}
      className="w-10 h-10 rounded-full glass-card card-shadow flex items-center justify-center"
      title={muted ? 'Activer la musique' : 'Couper la musique'}
    >
      <motion.div
        animate={{ rotate: muted ? 0 : 360 }}
        transition={{ duration: 0.3 }}
      >
        {muted ? (
          <VolumeX size={18} className="text-text-muted" />
        ) : (
          <Volume2 size={18} className="text-primary-pink-dark" />
        )}
      </motion.div>
    </motion.button>
  )
}
