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
  height?: number
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

export function getProjectOrientation(project: Project): 'landscape' | 'portrait' {
  const ref = project.coverImage?.asset?._ref
  if (ref) {
    const dims = getImageDimensions(ref)
    if (dims) return dims.width / dims.height > 1 ? 'landscape' : 'portrait'
  }
  return 'landscape'
}

export default function ProjectCard({
  project,
  width = 600,
  className = '',
  sizes = '(max-width: 768px) 90vw, 400px',
}: ProjectCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showCaption, setShowCaption] = useState(false)

  // Build slide sequence: cover + images + credits slide
  const slides = useMemo(() => {
    const result: Array<{
      type: 'image' | 'credits'
      image?: SanityImage
      localSrc?: string
      caption?: string
    }> = []

    if (project.coverImage?.asset?._ref || project.localCover) {
      result.push({
        type: 'image',
        image: project.coverImage?.asset?._ref ? project.coverImage : undefined,
        localSrc: project.localCover,
      })
    }

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
      for (let i = 1; i < project.localImages.length; i++) {
        result.push({
          type: 'image',
          localSrc: project.localImages[i],
        })
      }
    }

    result.push({ type: 'credits' })
    return result
  }, [project])

  const coverAspectRatio = useMemo(() => {
    const ref = project.coverImage?.asset?._ref
    if (ref) {
      const dims = getImageDimensions(ref)
      if (dims) return dims.width / dims.height
    }
    return undefined
  }, [project.coverImage])

  const isLandscape = coverAspectRatio ? coverAspectRatio > 1 : true
  const isTextOnly = !project.coverImage?.asset?._ref && !project.localCover
  const hasImage = !isTextOnly

  const totalSlides = slides.length
  const hasMultipleSlides = totalSlides > 1 && hasImage
  const currentSlideData = slides[currentSlide] || slides[0]
  const currentCaption = currentSlideData?.caption

  const advanceSlide = useCallback(() => {
    if (!hasMultipleSlides) return
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    setShowCaption(false)
  }, [hasMultipleSlides, totalSlides])

  const handleClick = useCallback(() => {
    if (currentCaption && !showCaption && typeof window !== 'undefined' && 'ontouchstart' in window) {
      setShowCaption(true)
      return
    }
    advanceSlide()
  }, [currentCaption, showCaption, advanceSlide])

  const currentImageUrl = useMemo(() => {
    if (!currentSlideData || currentSlideData.type === 'credits') return null
    if (currentSlideData.image) {
      return getSlideImageUrl(currentSlideData.image, width)
    }
    return currentSlideData.localSrc || null
  }, [currentSlideData, width])

  const isGif = currentSlideData?.image?.asset?._ref?.endsWith('-gif') || false
  const isCover = currentSlide === 0

  const containerStyle: React.CSSProperties = {}
  if (!isCover && coverAspectRatio) {
    containerStyle.aspectRatio = `${coverAspectRatio}`
  }

  // Text-only card
  if (isTextOnly) {
    return (
      <div className={`${styles.card} ${styles.textOnly} ${className}`}>
        {project.subtitle ? (
          <div className={styles.subtitle}>{project.subtitle}</div>
        ) : (
          <Link href={`/projet/${project.slug.current}`} className={styles.textOnlyTitle}>
            {project.title}
          </Link>
        )}
      </div>
    )
  }

  // Build info elements with middle dots
  const infoElements: React.ReactNode[] = []
  infoElements.push(
    <span key="title" className={isLandscape ? styles.infoTitle : styles.verticalInfoTitle}>
      {project.title}
    </span>
  )
  if (project.venue) {
    infoElements.push(<span key="sep-venue"> · </span>)
    infoElements.push(<span key="venue" className={styles.infoDetail}>{project.venue}</span>)
  }
  if (project.location) {
    infoElements.push(<span key="sep-loc"> · </span>)
    infoElements.push(
      <span key="loc" className={styles.infoDetail}>
        {project.location.split(',')[0]}
        {project.country && `, ${project.country}`}
      </span>
    )
  }
  if (project.year) {
    infoElements.push(<span key="sep-year"> · </span>)
    infoElements.push(<span key="year" className={styles.infoDetail}>{project.year}</span>)
  }

  const imageBlock = (
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
    </div>
  )

  return (
    <div
      className={`${styles.card} ${className} ${hasMultipleSlides ? styles.clickable : ''}`}
      onClick={hasMultipleSlides ? handleClick : undefined}
    >
      {project.subtitle && (
        <div className={styles.subtitle}>{project.subtitle}</div>
      )}

      {!isLandscape ? (
        /* Portrait: image + vertical info side by side */
        <div className={styles.imageWrapperPortrait}>
          <div className={styles.imageColumn}>
            {imageBlock}
          </div>
          <Link href={`/projet/${project.slug.current}`} className={styles.verticalInfo}>
            {infoElements}
          </Link>
        </div>
      ) : (
        /* Landscape: image full width, horizontal info below */
        <>
          {imageBlock}
          <div className={styles.info}>
            <Link href={`/projet/${project.slug.current}`} className={styles.infoLink}>
              {infoElements}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
