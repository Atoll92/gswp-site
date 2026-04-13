'use client'

import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ProjectCarousel from '@/components/ProjectCarousel/ProjectCarousel'
import type { Project } from '@/lib/types'
import { urlFor } from '../../../../sanity/lib/image'
import styles from './page.module.css'

interface ProjectDetailClientProps {
  project: Project
  relatedProjects: Project[]
}

export default function ProjectDetailClient({ project, relatedProjects }: ProjectDetailClientProps) {
  const allImages = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.images || []),
  ]

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div style={{ padding: '0 var(--page-padding)' }}>
          <Link href="/" className={styles.backLink}>
            &larr; Back
          </Link>
        </div>
        <div className={styles.carouselSection}>
          <ProjectCarousel
            images={allImages}
            localImages={project.localImages}
            title={project.title}
          />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{project.title}</h1>

          <div className={styles.meta}>
            {project.projectType && (
              <span className={styles.metaLine}>{project.projectType}</span>
            )}
            {project.surface && (
              <span className={styles.metaLine}>Surface : {project.surface}</span>
            )}
            {project.curator && (
              <span className={styles.metaLine}>Curator : {project.curator}</span>
            )}
            {project.venue && (
              <span className={styles.metaLine}>{project.venue}</span>
            )}
            {project.location && (
              <span className={styles.metaLine}>{project.location}</span>
            )}
            {project.year && (
              <span className={styles.metaLine}>{project.year}</span>
            )}
          </div>

          <div>
            {project.description && (
              <p className={styles.description}>{project.description}</p>
            )}
          </div>
        </div>

        {relatedProjects.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>
              {project.category?.title}
            </h2>
            <div className={styles.relatedGrid}>
              {relatedProjects.map((related) => {
                const hasSanityImage = related.coverImage?.asset?._ref
                const isGif = hasSanityImage?.endsWith('-gif')
                const thumbUrl = hasSanityImage
                  ? isGif
                    ? urlFor(related.coverImage).url()
                    : urlFor(related.coverImage).width(400).url()
                  : null

                return (
                  <Link
                    key={related._id}
                    href={`/projet/${related.slug.current}`}
                    className={styles.relatedCard}
                  >
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={related.title}
                        width={200}
                        height={150}
                        className={styles.relatedImage}
                        sizes="(max-width: 768px) 30vw, 200px"
                        unoptimized={isGif}
                      />
                    ) : (
                      <div className={styles.relatedPlaceholder} />
                    )}
                    <span className={styles.relatedName}>{related.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  )
}
