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

const imageSizes = [
  { width: 600, height: 450 },
  { width: 350, height: 260 },
  { width: 500, height: 620 },
  { width: 700, height: 400 },
  { width: 300, height: 400 },
  { width: 450, height: 340 },
]

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
        {shuffled.map((project, i) => {
          const size = imageSizes[i % imageSizes.length]
          return (
            <div key={project._id} className={styles.item}>
              <ProjectCard
                project={project}
                width={size.width}
                height={size.height}
                sizes="(max-width: 768px) 90vw, 40vw"
              />
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
