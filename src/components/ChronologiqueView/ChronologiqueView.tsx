'use client'

import { useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './ChronologiqueView.module.css'
import ScatteredGrid from '../ScatteredGrid/ScatteredGrid'
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

  const yearRefs = useRef<Record<number, HTMLDivElement | null>>({})

  function scrollToYear(year: number) {
    yearRefs.current[year]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <nav className={styles.yearNav}>
        {grouped.map(({ year }) => (
          <button
            key={year}
            className={styles.yearNavLink}
            onClick={() => scrollToYear(year)}
          >
            {year}
          </button>
        ))}
      </nav>

      {grouped.map(({ year, projects: yearProjects }) => (
        <div
          key={year}
          className={styles.yearGroup}
          ref={(el) => { yearRefs.current[year] = el }}
        >
          <h2 className={styles.yearTitle}>{year}</h2>
          <ScatteredGrid projects={yearProjects} />
        </div>
      ))}
    </motion.div>
  )
}
