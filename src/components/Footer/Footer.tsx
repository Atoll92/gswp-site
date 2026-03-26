import { forwardRef } from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'
import type { SiteSettings } from '@/lib/types'

interface FooterProps {
  settings?: SiteSettings | null
}

const Footer = forwardRef<HTMLElement, FooterProps>(function Footer({ settings }, ref) {
  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.info}>
        <div className={styles.address}>
          {settings?.address ? (
            settings.address.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))
          ) : (
            <>16 rue Léopold Bellan<br />75002 Paris</>
          )}
        </div>
        {settings?.email && (
          <a href={`mailto:${settings.email}`} className={styles.email}>{settings.email}</a>
        )}
        {settings?.phone && (
          <span className={styles.phone}>{settings.phone}</span>
        )}
      </div>
      <nav className={styles.nav}>
        <Link href="/a-propos" className={styles.navLink}>About</Link>
        <Link href="/contact" className={styles.navLink}>Contact</Link>
        <Link href="/" className={styles.navLink}>Portfolio</Link>
      </nav>
    </footer>
  )
})

export default Footer
