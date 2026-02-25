'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import styles from './ChronologiqueView.module.css'
import ProjectCard from '../ProjectCard/ProjectCard'
import type { Project } from '@/lib/types'

interface ChronologiqueViewProps {
  projects: Project[]
}

export default function ChronologiqueView({ projects }: ChronologiqueViewProps) {
  const grouped = useMemo(() => {
    const groups: Record<number, Project[]> = {}
    for (const project of projects) {
      const year = project.year || 0
      if (!groups[year]) groups[year] = []
      groups[year].push(project)
    }
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, items]) => ({ year: Number(year), projects: items }))
  }, [projects])

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {grouped.map(({ year, projects: yearProjects }) => (
        <div key={year} className={styles.yearGroup}>
          <div className={styles.yearLabel}>{year}</div>
          <div className={styles.row}>
            {yearProjects.map((project) => (
              <div key={project._id} className={styles.item}>
                <ProjectCard
                  project={project}
                  width={400}
                  height={280}
                  sizes="(max-width: 768px) 220px, 380px"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
