'use client'

import Image from 'next/image'
import styles from './ProjectCarousel.module.css'
import type { SanityImage } from '@/lib/types'
import { urlFor } from '../../../sanity/lib/image'

interface ProjectCarouselProps {
  images: SanityImage[]
  title: string
}

export default function ProjectCarousel({ images, title }: ProjectCarouselProps) {
  // Filter out images with no valid asset ref (sample data placeholders)
  const validImages = images.filter((img) => img?.asset?._ref)

  if (validImages.length === 0) return null

  return (
    <div className={styles.carousel}>
      <div className={styles.track}>
        {validImages.map((image, i) => {
          const url = urlFor(image).height(500).url()
          return (
            <div key={i} className={styles.slide}>
              <Image
                src={url}
                alt={`${title} — ${i + 1}`}
                width={750}
                height={500}
                sizes="auto"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
