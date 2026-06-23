'use client'

import { motion } from 'framer-motion'
import { Home, Heart, Music, Mail, Video } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/rsvp', icon: Heart, label: 'RSVP' },
  { href: '/video', icon: Video, label: 'Vidéo' },
  { href: '/playlist', icon: Music, label: 'Playlist' },
  { href: '/message', icon: Mail, label: 'Message' },
]

export default function BottomNav() {
  const pathname = usePathname()

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center z-50"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
        className="nav-pill rounded-full px-4 py-2 flex items-center gap-1"
      >
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="relative flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #F4A7B9 0%, #C9A7E8 100%)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative z-10"
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? 'text-white' : 'text-text-muted'}
                    fill={isActive ? 'white' : 'none'}
                  />
                </motion.div>
                <span
                  className={`relative z-10 text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}
