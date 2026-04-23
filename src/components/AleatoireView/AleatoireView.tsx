'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import styles from './AleatoireView.module.css'
import ScatteredGrid from '../ScatteredGrid/ScatteredGrid'
import type { Project } from '@/lib/types'

interface AleatoireViewProps {
  projects: Project[]
  ordered?: boolean
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

// Ensure linked projects appear adjacent in the array
function enforceLinkedAdjacency(items: Project[]): Project[] {
  const result = [...items]
  const processed = new Set<string>()

  for (let i = 0; i < result.length; i++) {
    const project = result[i]
    if (processed.has(project._id)) continue
    processed.add(project._id)

    const linkedIds = project.linkedProjectIds || []
    if (linkedIds.length === 0) continue

    let insertAt = i + 1
    for (const linkedId of linkedIds) {
      const linkedIdx = result.findIndex((p, idx) => p._id === linkedId && idx > i)
      if (linkedIdx > -1 && linkedIdx !== insertAt) {
        const [linked] = result.splice(linkedIdx, 1)
        result.splice(insertAt, 0, linked)
        processed.add(linked._id)
        insertAt++
      }
    }
  }
  return result
}

export default function AleatoireView({ projects, ordered }: AleatoireViewProps) {
  const displayProjects = useMemo(() => {
    let items: Project[]
    if (ordered) {
      items = projects
    } else {
      const seed = Math.floor(Date.now() / 86400000)
      items = seededShuffle(projects, seed)
    }
    return enforceLinkedAdjacency(items)
  }, [projects, ordered])

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ScatteredGrid projects={displayProjects} />
    </motion.div>
  )
}
