'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import styles from './AleatoireView.module.css'
import ScatteredGrid from '../ScatteredGrid/ScatteredGrid'
import type { Project } from '@/lib/types'

interface AleatoireViewProps {
  projects: Project[]
  categoryTitle?: string
}

// Seeded shuffle for consistent randomization per session
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  let currentSeed = seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 16807) % 2147483647
    const j = currentSeed % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function AleatoireView({ projects, categoryTitle }: AleatoireViewProps) {
  const shuffled = useMemo(() => {
    const seed = Math.floor(Date.now() / 86400000) // Changes daily
    return seededShuffle(projects, seed)
  }, [projects])

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {categoryTitle && (
        <motion.h1
          key={categoryTitle}
          className={styles.sectionTitle}
          initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {categoryTitle}
        </motion.h1>
      )}
      <ScatteredGrid projects={shuffled} />
    </motion.div>
  )
}
