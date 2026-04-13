'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import styles from './InfoPanel.module.css'
import type { SiteSettings } from '@/lib/types'

interface InfoPanelProps {
  isOpen: boolean
  onClose: () => void
  bio: any[] | null
  settings: SiteSettings | null
}

export default function InfoPanel({ isOpen, onClose, bio, settings }: InfoPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className={styles.panel}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className={styles.content}>
              <div className={styles.subtitle}>Atelier Architecture Scénographie</div>

              {settings?.address && (
                <div className={styles.address}>
                  {settings.address.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              )}

              {!settings?.address && (
                <div className={styles.address}>
                  16 rue Léopold Bellan<br />
                  75002 Paris
                </div>
              )}

              {settings?.email && (
                <div className={styles.contact}>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </div>
              )}

              {bio && bio.length > 0 && (
                <div className={styles.bio}>
                  {bio.map((block: any, i: number) => {
                    if (block._type === 'block') {
                      return (
                        <p key={block._key || i}>
                          {block.children?.map((child: any) => child.text).join('')}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>
              )}

              <nav className={styles.nav}>
                <Link href="/a-propos" className={styles.navLink} onClick={onClose}>About</Link>
                <Link href="/contact" className={styles.navLink} onClick={onClose}>Contact</Link>
                <Link href="/" className={styles.navLink} onClick={onClose}>Portfolio</Link>
              </nav>

              <div className={styles.credits}>
                <span>design : Beno&icirc;t Magdelaine</span>
                <span>development : Double Geste</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
