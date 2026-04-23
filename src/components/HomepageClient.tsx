'use client'

import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import Header from './Header/Header'
import AleatoireView from './AleatoireView/AleatoireView'
import ChronologiqueView from './ChronologiqueView/ChronologiqueView'
import type { Project, Category, SiteSettings } from '@/lib/types'

// Category keys matching the flat header menu
const CATEGORY_KEYS = [
  'theaters',
  'architectures',
  'expos',
  'shows',
]

// Map header menu keys to Sanity category slugs
const CATEGORY_SLUG_MAP: Record<string, string> = {
  'theaters': 'architecture-theatres',
  'architectures': 'architecture-interieurs',
  'expos': 'expositions',
  'shows': 'defiles',
}

interface HomepageClientProps {
  projects: Project[]
  categories: Category[]
  aboutBio?: any[] | null
  settings?: SiteSettings | null
  homeOrder?: string[]
  categoryOrders?: Record<string, string[]>
}

export default function HomepageClient({
  projects,
  categories,
  aboutBio,
  settings,
  homeOrder = [],
  categoryOrders = {},
}: HomepageClientProps) {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'home'

  const isCategory = CATEGORY_KEYS.includes(view)

  // InfoPanel state (controlled from here, passed to Header)
  const [infoPanelOpen, setInfoPanelOpen] = useState(false)
  const wasAutoOpenedRef = useRef(false)
  const lastScrollYRef = useRef(0)

  // Home view: use admin-defined order if available, otherwise all projects
  const homeProjects = useMemo(() => {
    if (homeOrder.length === 0) return projects
    const projectMap = new Map(projects.map((p) => [p._id, p]))
    const ordered = homeOrder
      .map((id) => projectMap.get(id))
      .filter((p): p is Project => p !== undefined)
    return ordered.length > 0 ? ordered : projects
  }, [projects, homeOrder])

  const filteredProjects = useMemo(() => {
    if (!isCategory) return homeProjects
    const sanitySlug = CATEGORY_SLUG_MAP[view]
    const categoryProjects = projects.filter((p) => p.category?.slug?.current === sanitySlug)

    // Apply category-specific ordering if available
    const orderIds = categoryOrders[sanitySlug]
    if (orderIds && orderIds.length > 0) {
      const projectMap = new Map(categoryProjects.map((p) => [p._id, p]))
      const ordered = orderIds
        .map((id) => projectMap.get(id))
        .filter((p): p is Project => p !== undefined)
      const orderedIds = new Set(orderIds)
      const remaining = categoryProjects.filter((p) => !orderedIds.has(p._id))
      return [...ordered, ...remaining]
    }
    return categoryProjects
  }, [projects, homeProjects, view, isCategory, categoryOrders])

  // Open sidebar when user scrolls to the bottom sentinel
  const sentinelRef = useRef<HTMLDivElement>(null)
  const hasTriggeredRef = useRef(false)

  // Close sidebar and reset trigger when view changes
  useEffect(() => {
    hasTriggeredRef.current = false
    setInfoPanelOpen(false)
    wasAutoOpenedRef.current = false
  }, [view])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true
          wasAutoOpenedRef.current = true
          setInfoPanelOpen(true)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Close sidebar when scrolling up after auto-open
  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      if (wasAutoOpenedRef.current && infoPanelOpen && currentY < lastScrollYRef.current - 50) {
        setInfoPanelOpen(false)
        wasAutoOpenedRef.current = false
      }
      lastScrollYRef.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [infoPanelOpen])

  // Reset trigger flag when panel is closed so it can fire again on next scroll-to-bottom
  const handleInfoPanelChange = useCallback((open: boolean) => {
    setInfoPanelOpen(open)
    if (!open) {
      hasTriggeredRef.current = false
      wasAutoOpenedRef.current = false
    }
  }, [])

  return (
    <>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'var(--color-bg)',
        }}
      >
        <Header
          bio={aboutBio}
          settings={settings}
          infoPanelOpen={infoPanelOpen}
          onInfoPanelChange={handleInfoPanelChange}
        />
        <main>
          <AnimatePresence mode="wait">
            {(view === 'home' || isCategory) && (
              <AleatoireView
                key={view}
                projects={filteredProjects}
                ordered={view === 'home' && homeOrder.length > 0}
              />
            )}
            {view === 'timeline' && (
              <ChronologiqueView key="timeline" projects={projects} />
            )}
          </AnimatePresence>
        </main>
        {/* Sentinel: triggers sidebar when user scrolls to bottom */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </>
  )
}
