'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './ChronologiqueView.module.css'
import ScatteredGrid from '../ScatteredGrid/ScatteredGrid'
import type { Project } from '@/lib/types'

interface ChronologiqueViewProps {
  projects: Project[]
  yearOrders?: Record<number, string[]>
}

export default function ChronologiqueView({ projects, yearOrders = {} }: ChronologiqueViewProps) {
  const [visibleYear, setVisibleYear] = useState<number | null>(null)

  const grouped = useMemo(() => {
    const groups: Record<number, Project[]> = {}
    for (const project of projects) {
      const year = project.year || 0
      if (!groups[year]) groups[year] = []
      groups[year].push(project)
    }
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([yearStr, items]) => {
        const year = Number(yearStr)
        const orderIds = yearOrders[year]
        if (orderIds && orderIds.length > 0) {
          const projectMap = new Map(items.map((p) => [p._id, p]))
          const ordered = orderIds
            .map((id) => projectMap.get(id))
            .filter((p): p is Project => p !== undefined)
          const orderedIds = new Set(orderIds)
          const remaining = items.filter((p) => !orderedIds.has(p._id))
          return { year, projects: [...ordered, ...remaining] }
        }
        return {
          year,
          projects: items.sort((a, b) => (a.order || 999) - (b.order || 999)),
        }
      })
  }, [projects, yearOrders])

  const yearRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const yearNavRefs = useRef<Record<number, HTMLSpanElement | null>>({})
  const navRef = useRef<HTMLElement>(null)

  // Auto-scroll nav to keep active year visible on mobile
  useEffect(() => {
    if (visibleYear == null) return
    const btn = yearNavRefs.current[visibleYear]
    const nav = navRef.current
    if (!btn || !nav) return
    const btnRect = btn.getBoundingClientRect()
    const navRect = nav.getBoundingClientRect()
    if (btnRect.left < navRect.left || btnRect.right > navRect.right) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [visibleYear])

  // Track which year section is currently in view
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    for (const { year } of grouped) {
      const el = yearRefs.current[year]
      if (!el) continue
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleYear(year)
          }
        },
        { rootMargin: '-20% 0px -60% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    }
    return () => observers.forEach((o) => o.disconnect())
  }, [grouped])

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
      <nav className={styles.yearNav} ref={navRef}>
        {grouped.map(({ year }, i) => (
          <span key={year} className={styles.yearNavItem} ref={(el) => { yearNavRefs.current[year] = el }}>
            <button
              className={`${styles.yearNavLink} ${
                visibleYear === year ? styles.yearNavLinkActive : ''
              }`}
              onClick={() => scrollToYear(year)}
            >
              {year}
            </button>
            {i < grouped.length - 1 && (
              <span className={styles.yearSeparator}>·</span>
            )}
          </span>
        ))}
      </nav>

      {grouped.map(({ year, projects: yearProjects }) => (
        <div
          key={year}
          className={styles.yearGroup}
          ref={(el) => { yearRefs.current[year] = el }}
        >
          <ScatteredGrid projects={yearProjects} />
        </div>
      ))}
    </motion.div>
  )
}
