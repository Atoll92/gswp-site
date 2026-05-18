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
// Deterministic vertical margin offsets to break grid alignment
const MARGIN_OFFSETS = [10, 18, 14, 20, 12, 16]

export default function ScatteredGrid({
  projects,
  imageWidth = 600,
  sizes = '(max-width: 768px) 90vw, 40vw',
}: ScatteredGridProps) {
  let landscapeIdx = 0
  let portraitIdx = 0
  let marginIdx = 0

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

        // Apply displaySize multiplier
        const sizeMultiplier = (project.displaySize || 100) / 100
        const adjustedWidth = Math.round(itemWidth * sizeMultiplier)

        // Randomized vertical margin offset to break alignment
        const extraMargin = MARGIN_OFFSETS[marginIdx % MARGIN_OFFSETS.length]
        marginIdx++

        return (
          <div
            key={project._id}
            className={styles.item}
            style={{ width: `${adjustedWidth}px`, marginTop: `${22 + extraMargin}px` }}
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
