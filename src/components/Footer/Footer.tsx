import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link href="/a-propos" className={styles.navLink}>About</Link>
        <Link href="/contact" className={styles.navLink}>Contact</Link>
        <Link href="/" className={styles.navLink}>Portfolio</Link>
      </nav>
    </footer>
  )
}
