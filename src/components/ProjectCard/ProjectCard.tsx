'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './ProjectCard.module.css'
import type { Project } from '@/lib/types'
import { urlFor } from '../../../sanity/lib/image'

interface ProjectCardProps {
  project: Project
  width?: number
  height?: number
  className?: string
  sizes?: string
}

export default function ProjectCard({
  project,
  width = 400,
  height = 300,
  className = '',
  sizes = '(max-width: 768px) 90vw, 400px',
}: ProjectCardProps) {
  const hasSanityImage = project.coverImage?.asset?._ref
  const imageUrl = hasSanityImage
    ? urlFor(project.coverImage).width(width).height(height).url()
    : project.localCover || null

  return (
    <Link
      href={`/projet/${project.slug.current}`}
      className={`${styles.card} ${className}`}
    >
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.title}
            width={width}
            height={height}
            className={styles.image}
            sizes={sizes}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderTitle}>{project.title}</span>
          </div>
        )}
        <div className={styles.overlay}>
          <div className={styles.overlayTitle}>{project.title}</div>
          {project.venue && (
            <div className={styles.overlayVenue}>{project.venue}</div>
          )}
          {project.location && (
            <div className={styles.overlayLocation}>
              {project.location.split(',')[0]},{' '}
              <span>{project.country || project.location.split(',')[1]?.trim()}</span>
            </div>
          )}
          {project.year && (
            <div className={styles.overlayYear}>{project.year}</div>
          )}
        </div>
      </div>
    </Link>
  )
}
