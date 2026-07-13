'use client'

import { motion } from 'framer-motion'
import { Home, CalendarCheck, Gift, Headphones, PenLine, Clapperboard } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/rsvp', icon: CalendarCheck, label: 'RSVP' },
  { href: '/video', icon: Clapperboard, label: 'Vidéo' },
  { href: '/playlist', icon: Headphones, label: 'Playlist' },
  { href: '/message', icon: PenLine, label: 'Message' },
  { href: '/cagnotte', icon: Gift, label: 'Cagnotte' },
]

export default function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex flex-col items-center z-50 gap-2"
      style={{ paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Arrow AI credit */}
      <a
        href="https://arrow-ai.us"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(255,252,248,0.7)', backdropFilter: 'blur(10px)' }}
      >
        <img src="/arrow-icon.png" width={11} height={11} alt="" aria-hidden />
        <span className="text-[9px] text-text-muted font-sans">Powered by</span>
        <span
          className="text-[9px] text-text-dark uppercase tracking-widest font-sans"
          style={{ fontWeight: 700 }}
        >
          Arrow AI
        </span>
      </a>

      {/* Nav pill */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
        className="nav-pill rounded-full px-2 py-2 flex items-center gap-0.5 max-w-[calc(100vw-1.5rem)] overflow-x-auto no-scrollbar"
      >
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.83 }}
                className="relative flex min-w-[52px] flex-col items-center px-2 py-2 rounded-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #B87A6A 0%, #7A6B9A 100%)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative z-10"
                >
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.6}
                    className={isActive ? 'text-white' : 'text-text-muted'}
                  />
                </motion.div>
                <span
                  className={`relative z-10 text-[9px] mt-0.5 font-medium transition-colors duration-200 font-sans ${
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
