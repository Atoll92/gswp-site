'use client'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import type { SiteSettings } from '@/lib/types'
import styles from './page.module.css'

interface ContactClientProps {
  settings: SiteSettings | null
}

export default function ContactClient({ settings }: ContactClientProps) {
  const firmName = settings?.firmName || 'Georgi Stanishev & William Parlon'
  const address = settings?.address || '16 rue Léopold Bellan\n75002 Paris'
  const email = settings?.email || 'contact@gswp.fr'
  const phone = settings?.phone || ''

  return (
    <>
      <Header />
      <div className={styles.page}>
        <h1 className={styles.title}>Contact</h1>
        <div className={styles.info}>
          <div className={styles.label}>{firmName}</div>
          <div>Atelier Architecture Scénographie</div>

          <div className={styles.label}>Adresse</div>
          <div className={styles.address}>{address}</div>

          <div className={styles.label}>Email</div>
          <div className={styles.email}>
            <a href={`mailto:${email}`}>{email}</a>
          </div>

          {phone && (
            <>
              <div className={styles.label}>Téléphone</div>
              <div className={styles.phone}>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
