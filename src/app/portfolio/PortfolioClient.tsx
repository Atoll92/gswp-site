'use client'

import Link from 'next/link'
import Header from '@/components/Header/Header'
import type { SiteSettings, PortfolioPage } from '@/lib/types'
import styles from './page.module.css'

interface PortfolioClientProps {
  settings: SiteSettings | null
  bio?: any[] | null
  portfolio: PortfolioPage | null
}

export default function PortfolioClient({ settings, bio, portfolio }: PortfolioClientProps) {
  const pdfs = portfolio?.pdfs || []

  return (
    <>
      <Header bio={bio || null} settings={settings} />
      <div className={styles.page}>
        <Link href="/" className={styles.backLink}>&larr; Back</Link>
        <h1 className={styles.title}>Portfolio</h1>
        {pdfs.length > 0 ? (
          <div className={styles.list}>
            {pdfs.map((pdf, i) => (
              <a
                key={i}
                href={pdf.file?.asset?.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pdfLink}
              >
                {pdf.title}
              </a>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Aucun document pour le moment.</p>
        )}
      </div>
    </>
  )
}
