'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface FeatureCardProps {
  Icon: LucideIcon
  title: string
  subtitle: string
  href: string
  gradient: string
  iconColor?: string
  delay?: number
}

export default function FeatureCard({
  Icon,
  title,
  subtitle,
  href,
  gradient,
  iconColor = '#1E1812',
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay }}
    >
      <Link href={href} className="block">
        <motion.div
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="rounded-3xl p-5 card-shadow relative overflow-hidden cursor-pointer"
          style={{ background: gradient }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/15" aria-hidden />
          <div className="absolute -right-2 -bottom-10 w-20 h-20 rounded-full bg-white/10" aria-hidden />

          <div className="relative z-10">
            {/* Icon container */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
              className="w-11 h-11 rounded-2xl bg-white/50 flex items-center justify-center mb-4"
            >
              <Icon size={22} strokeWidth={1.8} style={{ color: iconColor }} />
            </motion.div>

            <h3 className="text-base font-semibold text-text-dark leading-tight font-sans">
              {title}
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-snug font-sans">
              {subtitle}
            </p>

            <div className="mt-4">
              <div className="w-7 h-7 rounded-full bg-white/40 flex items-center justify-center">
                <ArrowUpRight size={14} className="text-text-dark" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
