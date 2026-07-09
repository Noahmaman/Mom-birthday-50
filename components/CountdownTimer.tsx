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
      <div
        className="rounded-2xl px-3 py-3 min-w-[62px] flex items-center justify-center"
        style={{
          background: 'rgba(30, 24, 18, 0.92)',
          border: '1px solid rgba(30, 24, 18, 0.12)',
          boxShadow: '0 10px 24px rgba(30, 24, 18, 0.16)',
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.2 }}
            className="text-2xl font-semibold text-white tabular-nums font-sans"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest font-sans">
        {label}
      </span>
    </div>
  )
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
    { value: 0, label: 'Jours' },
    { value: 0, label: 'Heures' },
    { value: 0, label: 'Min' },
    { value: 0, label: 'Sec' },
  ])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const calculate = () => {
      const now = new Date()
      const diff = TARGET_DATE.getTime() - now.getTime()
      if (diff <= 0) {
        setTimeLeft([{ value: 0, label: 'Jours' }, { value: 0, label: 'Heures' }, { value: 0, label: 'Min' }, { value: 0, label: 'Sec' }])
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft([{ value: days, label: 'Jours' }, { value: hours, label: 'Heures' }, { value: minutes, label: 'Min' }, { value: seconds, label: 'Sec' }])
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center gap-3 justify-center">
        {['Jours', 'Heures', 'Min', 'Sec'].map((label) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div className="rounded-2xl px-3 py-3 min-w-[62px] flex items-center justify-center" style={{ background: 'rgba(30, 24, 18, 0.92)', border: '1px solid rgba(30, 24, 18, 0.12)' }}>
              <span className="text-2xl font-semibold text-white tabular-nums font-sans">00</span>
            </div>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest font-sans">{label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5 justify-center">
      {timeLeft.map((unit, i) => (
        <div key={unit.label} className="flex items-start gap-2.5">
          <FlipNumber value={unit.value} label={unit.label} />
          {i < timeLeft.length - 1 && (
            <span className="text-xl font-light text-text-muted mt-2.5">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
