'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface FeatureCardProps {
  emoji: string
  title: string
  subtitle: string
  href: string
  gradient: string
  delay?: number
}

export default function FeatureCard({
  emoji,
  title,
  subtitle,
  href,
  gradient,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22,
        delay,
      }}
    >
      <Link href={href} className="block">
        <motion.div
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="rounded-3xl p-5 card-shadow relative overflow-hidden cursor-pointer"
          style={{ background: gradient }}
        >
          {/* Decorative circle */}
          <div
            className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/20"
            aria-hidden
          />
          <div
            className="absolute -right-2 -bottom-10 w-20 h-20 rounded-full bg-white/15"
            aria-hidden
          />

          <div className="relative z-10">
            {/* Emoji */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay * 0.5,
              }}
              className="text-4xl mb-3"
            >
              {emoji}
            </motion.div>

            {/* Text */}
            <h3 className="text-lg font-bold text-text-dark leading-tight">
              {title}
            </h3>
            <p className="text-sm text-text-muted mt-1 leading-snug">
              {subtitle}
            </p>

            {/* Arrow */}
            <div className="mt-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
                <ChevronRight size={16} className="text-text-dark" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
