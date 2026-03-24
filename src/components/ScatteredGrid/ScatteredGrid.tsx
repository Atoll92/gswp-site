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

const posClasses = [
  styles.pos0,
  styles.pos1,
  styles.pos2,
  styles.pos3,
  styles.pos4,
  styles.pos5,
]

export default function ScatteredGrid({
  projects,
  imageWidth = 600,
  sizes = '(max-width: 768px) 70vw, 40vw',
}: ScatteredGridProps) {
  let visualIndex = 0

  return (
    <div className={styles.grid}>
      {projects.map((project) => {
        const posClass = posClasses[visualIndex % 6]
        visualIndex++

        const elements = [
          <div key={project._id} className={`${styles.item} ${posClass}`}>
            <ProjectCard
              project={project}
              width={imageWidth}
              sizes={sizes}
            />
          </div>,
        ]

        if (project.subtitle) {
          const extractPosClass = posClasses[visualIndex % 6]
          visualIndex++
          elements.push(
            <div
              key={`${project._id}-extract`}
              className={`${styles.item} ${styles.extractItem} ${extractPosClass}`}
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
