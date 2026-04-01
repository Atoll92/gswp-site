'use client'

import styles from './ScatteredGrid.module.css'
import ProjectCard, { getProjectOrientation } from '../ProjectCard/ProjectCard'
import type { Project } from '@/lib/types'

interface ScatteredGridProps {
  projects: Project[]
  imageWidth?: number
  sizes?: string
}

const LANDSCAPE_WIDTHS = [520, 580, 500, 640, 550, 600]
const PORTRAIT_WIDTHS = [300, 340, 360, 320, 380, 350]

export default function ScatteredGrid({
  projects,
  imageWidth = 600,
  sizes = '(max-width: 768px) 90vw, 40vw',
}: ScatteredGridProps) {
  let landscapeIdx = 0
  let portraitIdx = 0

  return (
    <div className={styles.grid}>
      {projects.map((project) => {
        const orientation = getProjectOrientation(project)
        let itemWidth: number
        if (orientation === 'portrait') {
          itemWidth = PORTRAIT_WIDTHS[portraitIdx % PORTRAIT_WIDTHS.length]
          portraitIdx++
        } else {
          itemWidth = LANDSCAPE_WIDTHS[landscapeIdx % LANDSCAPE_WIDTHS.length]
          landscapeIdx++
        }

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
