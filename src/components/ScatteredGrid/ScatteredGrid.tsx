'use client'

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

        return (
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
          </div>
        )
      })}
    </div>
  )
}
