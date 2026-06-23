'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TARGET_DATE = new Date('2026-08-30T00:00:00')

interface TimeUnit {
  value: number
  label: string
}

function FlipNumber({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="glass-card rounded-2xl px-3 py-3 min-w-[64px] flex items-center justify-center card-shadow">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.2 }}
            className="text-2xl font-bold text-text-dark tabular-nums"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
        {label}
      </span>
    </div>
  )
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
    { value: 0, label: 'Jours' },
    { value: 0, label: 'Heures' },
    { value: 0, label: 'Minutes' },
    { value: 0, label: 'Secondes' },
  ])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const calculate = () => {
      const now = new Date()
      const diff = TARGET_DATE.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft([
          { value: 0, label: 'Jours' },
          { value: 0, label: 'Heures' },
          { value: 0, label: 'Minutes' },
          { value: 0, label: 'Secondes' },
        ])
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft([
        { value: days, label: 'Jours' },
        { value: hours, label: 'Heures' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Secondes' },
      ])
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center gap-3 justify-center">
        {['Jours', 'Heures', 'Minutes', 'Secondes'].map((label) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div className="glass-card rounded-2xl px-3 py-3 min-w-[64px] flex items-center justify-center card-shadow">
              <span className="text-2xl font-bold text-text-dark tabular-nums">00</span>
            </div>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 justify-center">
      {timeLeft.map((unit, i) => (
        <div key={unit.label} className="flex items-start gap-3">
          <FlipNumber value={unit.value} label={unit.label} />
          {i < timeLeft.length - 1 && (
            <span className="text-2xl font-bold text-text-muted mt-2">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
