'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './ProjectCard.module.css'
import type { Project, SanityImage } from '@/lib/types'
import { urlFor, getImageDimensions } from '../../../sanity/lib/image'

interface ProjectCardProps {
  project: Project
  width?: number
  height?: number // kept for backward compatibility, not used
  className?: string
  sizes?: string
}

function getSlideImageUrl(
  image: SanityImage,
  width: number
): string | null {
  if (!image?.asset?._ref) return null
  const isGif = image.asset._ref.endsWith('-gif')
  return isGif
    ? urlFor(image).url()
    : urlFor(image).width(width * 2).url()
}

export default function ProjectCard({
  project,
  width = 600,
  className = '',
  sizes = '(max-width: 768px) 90vw, 400px',
}: ProjectCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showCaption, setShowCaption] = useState(false)

  // Build slide sequence: cover + images + credits slide (if credits exist)
  const slides = useMemo(() => {
    const result: Array<{
      type: 'image' | 'credits'
      image?: SanityImage
      localSrc?: string
      caption?: string
    }> = []

    // Slide 0: cover image
    if (project.coverImage?.asset?._ref || project.localCover) {
      result.push({
        type: 'image',
        image: project.coverImage?.asset?._ref ? project.coverImage : undefined,
        localSrc: project.localCover,
      })
    }

    // Slides 1..N: additional images from Sanity
    if (project.images?.length) {
      for (const img of project.images) {
        if (img?.asset?._ref) {
          result.push({
            type: 'image',
            image: img,
            caption: img.caption,
          })
        }
      }
    } else if (project.localImages && project.localImages.length > 1) {
      // Local images fallback (skip first = cover)
      for (let i = 1; i < project.localImages.length; i++) {
        result.push({
          type: 'image',
          localSrc: project.localImages[i],
        })
      }
    }

    // Last slide: always show credits/info
    result.push({ type: 'credits' })

    return result
  }, [project])

  // Get cover aspect ratio from Sanity ref
  const coverAspectRatio = useMemo(() => {
    const ref = project.coverImage?.asset?._ref
    if (ref) {
      const dims = getImageDimensions(ref)
      if (dims) return dims.width / dims.height
    }
    return undefined
  }, [project.coverImage])

  const totalSlides = slides.length
  const hasMultipleSlides = totalSlides > 1
  const currentSlideData = slides[currentSlide] || slides[0]
  const currentCaption = currentSlideData?.caption

  const advanceSlide = useCallback(() => {
    if (!hasMultipleSlides) return
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    setShowCaption(false)
  }, [hasMultipleSlides, totalSlides])

  const handleClick = useCallback(() => {
    // On touch devices: first tap shows caption if available, second tap advances
    if (currentCaption && !showCaption && typeof window !== 'undefined' && 'ontouchstart' in window) {
      setShowCaption(true)
      return
    }
    advanceSlide()
  }, [currentCaption, showCaption, advanceSlide])

  // Determine image URL for current slide
  const currentImageUrl = useMemo(() => {
    if (!currentSlideData || currentSlideData.type === 'credits') return null
    if (currentSlideData.image) {
      return getSlideImageUrl(currentSlideData.image, width)
    }
    return currentSlideData.localSrc || null
  }, [currentSlideData, width])

  const isGif = currentSlideData?.image?.asset?._ref?.endsWith('-gif') || false
  const isCover = currentSlide === 0

  // Cover: natural aspect ratio. Other slides: crop to cover's ratio
  const containerStyle: React.CSSProperties = {}
  if (!isCover && coverAspectRatio) {
    containerStyle.aspectRatio = `${coverAspectRatio}`
  }

  const hasDescription = Boolean(project.description)

  return (
    <div
      className={`${styles.card} ${className} ${hasMultipleSlides ? styles.clickable : ''}`}
      onClick={hasMultipleSlides ? handleClick : undefined}
    >
      {project.subtitle && (
        <div className={styles.subtitle}>{project.subtitle}</div>
      )}
      <div className={`${styles.imageWrapper} ${hasDescription ? styles.imageWrapperWithTitle : ''}`}>
        <div className={styles.imageContainer} style={containerStyle}>
          {currentSlideData?.type === 'credits' ? (
            <div className={styles.creditsSlide}>
              <p className={styles.creditsTitle}>{project.title}</p>
              {project.venue && <p>{project.venue}</p>}
              {project.location && (
                <p>
                  {project.location.split(',')[0]}
                  {project.country && `, ${project.country}`}
                </p>
              )}
              {project.year && <p>{project.year}</p>}
              {project.credits && <p className={styles.creditsText}>{project.credits}</p>}
            </div>
          ) : currentImageUrl ? (
            <>
              <Image
                src={currentImageUrl}
                alt={currentSlideData?.image?.alt || project.title}
                width={width}
                height={Math.round(width / (coverAspectRatio || 1.5))}
                className={`${styles.image} ${!isCover && coverAspectRatio ? styles.imageCropped : ''}`}
                sizes={sizes}
                unoptimized={isGif}
              />
              {currentCaption && (
                <span className={`${styles.caption} ${showCaption ? styles.captionVisible : ''}`}>
                  {currentCaption}
                </span>
              )}
            </>
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.placeholderTitle}>{project.title}</span>
            </div>
          )}

          {/* dots removed */}
        </div>

        {hasDescription && (
          <Link href={`/projet/${project.slug.current}`} className={styles.verticalTitle}>
            {project.title}
          </Link>
        )}
      </div>

      {hasDescription && (
        <div className={styles.description}>
          <p>{project.description}</p>
        </div>
      )}

      <div className={styles.info}>
        <Link href={`/projet/${project.slug.current}`} className={styles.infoLink}>
          <span className={styles.infoTitle}>{project.title}</span>
          {project.venue && (
            <>
              {' \u2014 '}
              <span className={styles.infoDetail}>{project.venue}</span>
            </>
          )}
          {project.location && (
            <>
              {' \u2014 '}
              <span className={styles.infoDetail}>
                {project.location.split(',')[0]}
                {project.country && (
                  <>
                    , <span className={styles.infoCountry}>{project.country}</span>
                  </>
                )}
              </span>
            </>
          )}
          {project.year && (
            <>
              {' \u2014 '}
              <span className={styles.infoDetail}>{project.year}</span>
            </>
          )}
        </Link>
      </div>
    </div>
  )
}
