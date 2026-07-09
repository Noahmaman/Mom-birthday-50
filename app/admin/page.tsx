'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!password) {
      setError('Veuillez entrer le mot de passe')
      return
    }

    setLoading(true)
    setError(null)

    // Simulate a slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 600))

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Noah'
    if (password === adminPassword) {
      sessionStorage.setItem('admin-auth', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Mot de passe incorrect')
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="glass-card rounded-4xl overflow-hidden card-shadow bg-white/90">
          <div className="relative h-44">
            <Image
              src="/covers/cover-1.jpg"
              alt="Cover anniversaire de Yael"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-white/75 text-xs font-semibold uppercase tracking-widest">
                30 Août 2026
              </p>
              <h1 className="text-white text-3xl font-light mt-1 font-display">
                Anniversaire Yael
              </h1>
            </div>
          </div>
          <div className="p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F4A7B9 0%, #C9A7E8 100%)' }}
          >
            <Lock size={28} className="text-white" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-text-dark">Espace Admin</h2>
            <p className="text-text-muted text-sm mt-1">
              Toutes les réponses, vidéos et messages
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm font-medium text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              className="w-full h-12 rounded-2xl"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </Button>
          </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-text-muted text-xs mt-4"
        >
          Accès réservé à l&apos;organisateur
        </motion.p>
      </motion.div>
    </div>
  )
}
