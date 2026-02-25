'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './ProjetsView.module.css'
import ProjectCard from '../ProjectCard/ProjectCard'
import type { Project, Category } from '@/lib/types'

interface ProjetsViewProps {
  projects: Project[]
  categories: Category[]
}

export default function ProjetsView({ projects, categories }: ProjetsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const groups: Record<string, { category: Category; projects: Project[] }> = {}
    for (const cat of categories) {
      groups[cat._id] = { category: cat, projects: [] }
    }
    for (const project of projects) {
      if (project.category && groups[project.category._id]) {
        groups[project.category._id].projects.push(project)
      }
    }
    return Object.values(groups)
      .filter((g) => g.projects.length > 0)
      .sort((a, b) => (a.category.order || 0) - (b.category.order || 0))
  }, [projects, categories])

  const filtered = activeCategory
    ? grouped.filter((g) => g.category._id === activeCategory)
    : grouped

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <nav className={styles.categoryNav}>
        {grouped.map((g) => (
          <button
            key={g.category._id}
            className={`${styles.categoryLink} ${
              activeCategory === g.category._id ? styles.categoryLinkActive : ''
            }`}
            onClick={() =>
              setActiveCategory(
                activeCategory === g.category._id ? null : g.category._id
              )
            }
          >
            {g.category.title}
          </button>
        ))}
      </nav>

      {filtered.map(({ category, projects: catProjects }) => (
        <div key={category._id} className={styles.categoryGroup}>
          <div className={styles.categoryLabel}>{category.title}</div>
          <div className={styles.row}>
            {catProjects.map((project) => (
              <div key={project._id} className={styles.item}>
                <ProjectCard
                  project={project}
                  width={360}
                  height={260}
                  sizes="(max-width: 768px) 200px, 340px"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
