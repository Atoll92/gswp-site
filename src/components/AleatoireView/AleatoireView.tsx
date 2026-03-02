'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import styles from './AleatoireView.module.css'
import ProjectCard from '../ProjectCard/ProjectCard'
import type { Project } from '@/lib/types'

interface AleatoireViewProps {
  projects: Project[]
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

// Width used to request appropriate resolution from Sanity
const IMAGE_WIDTH = 600

export default function AleatoireView({ projects }: AleatoireViewProps) {
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
      <div className={styles.grid}>
        {shuffled.map((project) => (
          <div key={project._id} className={styles.item}>
            <ProjectCard
              project={project}
              width={IMAGE_WIDTH}
              sizes="(max-width: 768px) 70vw, 40vw"
            />
          </div>
        ))}
      </div>
    </motion.div>
  )
}
