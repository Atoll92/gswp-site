'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './ProjetsView.module.css'
import ScatteredGrid from '../ScatteredGrid/ScatteredGrid'
import type { Project, Category } from '@/lib/types'

interface ProjetsViewProps {
  projects: Project[]
  categories: Category[]
  initialCategorySlug?: string
}

export default function ProjetsView({ projects, categories, initialCategorySlug }: ProjetsViewProps) {
  const [visibleCategory, setVisibleCategory] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const hasScrolled = useRef(false)

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

  // Track which category section is currently in view
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    for (const { category } of grouped) {
      const el = sectionRefs.current[category._id]
      if (!el) continue
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCategory(category._id)
          }
        },
        { rootMargin: '-20% 0px -60% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    }
    return () => observers.forEach((o) => o.disconnect())
  }, [grouped])

  // Auto-scroll to initial category on mount
  useEffect(() => {
    if (!initialCategorySlug || hasScrolled.current) return
    const target = grouped.find((g) => g.category.slug.current === initialCategorySlug)
    if (target) {
      const el = sectionRefs.current[target.category._id]
      if (el) {
        hasScrolled.current = true
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
  }, [initialCategorySlug, grouped])

  function scrollToCategory(id: string) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <nav className={styles.categoryNav}>
        {grouped.map((g, i) => (
          <span key={g.category._id} className={styles.categoryNavItem}>
            <button
              className={`${styles.categoryLink} ${
                visibleCategory === g.category._id ? styles.categoryLinkActive : ''
              }`}
              onClick={() => scrollToCategory(g.category._id)}
            >
              {g.category.title}
            </button>
            {i < grouped.length - 1 && (
              <span className={styles.categorySeparator}>·</span>
            )}
          </span>
        ))}
      </nav>

      {grouped.map(({ category, projects: catProjects }) => (
        <div
          key={category._id}
          className={styles.categoryGroup}
          ref={(el) => { sectionRefs.current[category._id] = el }}
        >
          <ScatteredGrid projects={catProjects} />
        </div>
      ))}
    </motion.div>
  )
}
