import { useState } from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const [creditsOpen, setCreditsOpen] = useState(false)

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.info}>
          <div className={styles.firmName}>Georgi Stanishev & William Parlon</div>
          <div className={styles.subtitle}>Atelier Architecture Scénographie</div>
          <div className={styles.subtitle}>16 rue Léopold Bellan</div>
          <div className={styles.subtitle}>75002 Paris</div>
        </div>
        <nav className={styles.nav}>
          <Link href="/a-propos" className={styles.navLink}>À Propos</Link>
          <Link href="/journal" className={styles.navLink}>Journal</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
          <Link href="/" className={styles.navLink}>Portfolio</Link>
        </nav>
      </footer>
      <div className={styles.creditsWrapper}>
        <button
          className={styles.creditsToggle}
          onClick={() => setCreditsOpen(!creditsOpen)}
          aria-expanded={creditsOpen}
        >
          Crédits
        </button>
        <div className={`${styles.creditsDetails} ${creditsOpen ? styles.creditsOpen : ''}`}>
          <span>Graphisme : <a href="https://www.benoitmagdelaine.com" target="_blank" rel="noopener noreferrer">Benoit Magdelaine</a></span>
          <span>Développement web : <a href="https://www.doublegeste.com" target="_blank" rel="noopener noreferrer">Agence Double Geste</a></span>
        </div>
      </div>
    </>
  )
}
