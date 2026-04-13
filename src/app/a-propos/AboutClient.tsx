'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Header from '@/components/Header/Header'
import type { AboutPage, SiteSettings } from '@/lib/types'
import { urlFor } from '../../../sanity/lib/image'
import styles from './page.module.css'

interface AboutClientProps {
  about: AboutPage | null
  settings?: SiteSettings | null
}

export default function AboutClient({ about, settings }: AboutClientProps) {
  return (
    <>
      <Header bio={about?.bio || null} settings={settings || null} />
      <div className={styles.page}>
        <Link href="/" className={styles.backLink}>&larr; Back</Link>
        {about?.content && (
          <div className={styles.content}>
            <PortableText value={about.content} />
          </div>
        )}
        {about?.images && about.images.length > 0 && (
          <div className={styles.images}>
            {about.images.map((img, i) => (
              <Image
                key={i}
                src={urlFor(img).height(300).url()}
                alt={`À propos — ${i + 1}`}
                width={400}
                height={300}
              />
            ))}
          </div>
        )}
        {!about && (
          <div className={styles.content}>
            <p>
              Georgi Stanishev & William Parlon fondent leur atelier en 2020 à Paris.
              Leur pratique mêle architecture, scénographie et design spatial à travers
              des projets d&apos;exposition, des défilés de mode, des intérieurs et des
              installations.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
