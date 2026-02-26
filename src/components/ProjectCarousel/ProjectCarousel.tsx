'use client'

import Image from 'next/image'
import styles from './ProjectCarousel.module.css'
import type { SanityImage } from '@/lib/types'
import { urlFor } from '../../../sanity/lib/image'

interface ProjectCarouselProps {
  images: SanityImage[]
  localImages?: string[]
  title: string
}

export default function ProjectCarousel({ images, localImages, title }: ProjectCarouselProps) {
  // Use Sanity images if available, otherwise local images
  const sanityImages = images.filter((img) => img?.asset?._ref)

  if (sanityImages.length > 0) {
    return (
      <div className={styles.carousel}>
        <div className={styles.track}>
          {sanityImages.map((image, i) => (
            <div key={i} className={styles.slide}>
              <Image
                src={urlFor(image).height(500).url()}
                alt={`${title} — ${i + 1}`}
                width={750}
                height={500}
                sizes="auto"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (localImages && localImages.length > 0) {
    return (
      <div className={styles.carousel}>
        <div className={styles.track}>
          {localImages.map((src, i) => (
            <div key={i} className={styles.slide}>
              <Image
                src={src}
                alt={`${title} — ${i + 1}`}
                width={750}
                height={500}
                sizes="auto"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
