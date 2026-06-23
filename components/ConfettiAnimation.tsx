'use client'

import { useEffect } from 'react'

export default function ConfettiAnimation() {
  useEffect(() => {
    let cancelled = false

    const launchConfetti = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default

        if (cancelled) return

        const fire = (particleRatio: number, opts: Record<string, unknown>) => {
          confetti({
            origin: { y: 0.7 },
            ...opts,
            particleCount: Math.floor(200 * particleRatio),
          })
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          colors: ['#F4A7B9', '#E8849A', '#C9A7E8'],
        })
        fire(0.2, {
          spread: 60,
          colors: ['#FFE4A0', '#A8E6CF', '#A7C7E7'],
        })
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          colors: ['#F4A7B9', '#C9A7E8', '#FFE4A0'],
        })
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          colors: ['#E8849A', '#A8E6CF'],
        })
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
          colors: ['#F4A7B9', '#C9A7E8'],
        })
      } catch {
        // canvas-confetti not available, silently ignore
      }
    }

    launchConfetti()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
