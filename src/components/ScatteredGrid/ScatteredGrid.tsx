'use client'

import { Fragment } from 'react'
import styles from './ScatteredGrid.module.css'
import ProjectCard from '../ProjectCard/ProjectCard'
import type { Project } from '@/lib/types'

interface ScatteredGridProps {
  projects: Project[]
  imageWidth?: number
  sizes?: string
}

const WIDTHS = [500, 350, 420, 550, 400, 650, 300, 480]

export default function ScatteredGrid({
  projects,
  imageWidth = 600,
  sizes = '(max-width: 768px) 90vw, 40vw',
}: ScatteredGridProps) {
  let widthIndex = 0

  return (
    <div className={styles.grid}>
      {projects.map((project) => {
        const itemWidth = WIDTHS[widthIndex % WIDTHS.length]
        widthIndex++

        const elements = [
          <div
            key={project._id}
            className={styles.item}
            style={{ width: `${itemWidth}px` }}
          >
            <ProjectCard
              project={project}
              width={imageWidth}
              sizes={sizes}
            />
          </div>,
        ]

        if (project.subtitle) {
          const extractWidth = WIDTHS[widthIndex % WIDTHS.length]
          widthIndex++
          elements.push(
            <div
              key={`${project._id}-extract`}
              className={`${styles.item} ${styles.extractItem}`}
              style={{ width: `${extractWidth}px` }}
            >
              <p className={styles.extractText}>{project.subtitle}</p>
            </div>
          )
        }

        return <Fragment key={project._id}>{elements}</Fragment>
      })}
    </div>
  )
}
