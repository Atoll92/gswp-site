'use client'

import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ProjectCarousel from '@/components/ProjectCarousel/ProjectCarousel'
import type { Project } from '@/lib/types'
import styles from './page.module.css'

interface ProjectDetailClientProps {
  project: Project
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const allImages = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.images || []),
  ]

  return (
    <>
      <Header />
      <div className={styles.page}>
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

        <div style={{ padding: '0 var(--page-padding)' }}>
          <Link href="/" className={styles.backLink}>
            &larr; Retour
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
