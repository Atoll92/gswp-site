'use client'

import styles from './ScatteredGrid.module.css'
import ProjectCard from '../ProjectCard/ProjectCard'
import type { Project } from '@/lib/types'

interface ScatteredGridProps {
  projects: Project[]
  imageWidth?: number
  sizes?: string
}

export default function ScatteredGrid({
  projects,
  imageWidth = 600,
  sizes = '(max-width: 768px) 90vw, 33vw',
}: ScatteredGridProps) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <div key={project._id} className={styles.item}>
          <ProjectCard
            project={project}
            width={imageWidth}
            sizes={sizes}
          />
        </div>
      ))}
    </div>
  )
}
