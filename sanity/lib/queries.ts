import { draftMode } from 'next/headers'
import { isSanityConfigured, getClient } from './client'
import type { Project, Category, AboutPage, JournalPost, SiteSettings } from '@/lib/types'
import { sampleProjects, sampleCategories } from '@/lib/sampleData'

async function fetchClient() {
  const { isEnabled } = await draftMode()
  return getClient(isEnabled)
}

export async function getProjects(): Promise<Project[]> {
  if (!isSanityConfigured) return sampleProjects

  try {
    const client = await fetchClient()
    const results = await client.fetch(`
      *[_type == "project"] | order(order asc, year desc) {
        _id,
        title,
        slug,
        category->{_id, title, slug, order},
        year,
        location,
        country,
        venue,
        subtitle,
        credits,
        tags,
        coverImage,
        images[] {
          ...,
          caption
        },
        displaySize,
        order
      }
    `)
    return results.length > 0 ? results : sampleProjects
  } catch {
    console.warn('Sanity fetch failed for projects, using sample data')
    return sampleProjects
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!isSanityConfigured) {
    return sampleProjects.find((p) => p.slug.current === slug) || null
  }

  try {
    const client = await fetchClient()
    const result = await client.fetch(`
      *[_type == "project" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        category->{_id, title, slug, order},
        year,
        location,
        country,
        venue,
        subtitle,
        credits,
        tags,
        coverImage,
        images[] {
          ...,
          caption
        },
        displaySize,
        order
      }
    `, { slug })
    return result || sampleProjects.find((p) => p.slug.current === slug) || null
  } catch {
    return sampleProjects.find((p) => p.slug.current === slug) || null
  }
}

export async function getRelatedProjects(categoryId: string, excludeId: string): Promise<Project[]> {
  if (!isSanityConfigured) {
    return sampleProjects.filter(
      (p) => p.category?._id === categoryId && p._id !== excludeId
    )
  }

  try {
    const client = await fetchClient()
    const results = await client.fetch(`
      *[_type == "project" && category._ref == $categoryId && _id != $excludeId] | order(order asc, year desc) {
        _id,
        title,
        slug,
        category->{_id, title, slug, order},
        year,
        location,
        country,
        venue,
        coverImage,
        order
      }
    `, { categoryId, excludeId })
    return results || []
  } catch {
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return sampleCategories

  try {
    const client = await fetchClient()
    const results = await client.fetch(`
      *[_type == "category"] | order(order asc) {
        _id,
        title,
        slug,
        order
      }
    `)
    return results.length > 0 ? results : sampleCategories
  } catch {
    return sampleCategories
  }
}

export async function getHomeOrder(): Promise<{ order: string[]; excluded: string[] }> {
  if (!isSanityConfigured) return { order: [], excluded: [] }

  try {
    const client = await fetchClient()
    const result = await client.fetch(`
      *[_type == "homePage" && _id == "homePage"][0] {
        "projectIds": projects[]._ref,
        "excludedIds": excludedProjects[]._ref
      }
    `)
    return {
      order: result?.projectIds || [],
      excluded: result?.excludedIds || [],
    }
  } catch {
    return { order: [], excluded: [] }
  }
}

export async function getCategoryOrders(): Promise<Record<string, { order: string[] }>> {
  if (!isSanityConfigured) return {}

  try {
    const client = await fetchClient()
    const results = await client.fetch(`
      *[_type == "categoryPage"] {
        "slug": category->slug.current,
        "projectIds": projects[]._ref
      }
    `)
    const map: Record<string, { order: string[] }> = {}
    for (const r of results) {
      if (r.slug) {
        map[r.slug] = { order: r.projectIds || [] }
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function getAboutPage(): Promise<AboutPage | null> {
  if (!isSanityConfigured) return null

  try {
    const client = await fetchClient()
    return await client.fetch(`
      *[_type == "aboutPage" && _id == "aboutPage"][0] {
        bio,
        content,
        images
      }
    `)
  } catch {
    return null
  }
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  if (!isSanityConfigured) return []

  try {
    const client = await fetchClient()
    return await client.fetch(`
      *[_type == "journalPost"] | order(date desc) {
        _id,
        title,
        slug,
        date,
        content,
        coverImage
      }
    `)
  } catch {
    return []
  }
}

export async function getYearOrders(): Promise<Record<number, string[]>> {
  if (!isSanityConfigured) return {}

  try {
    const client = await fetchClient()
    const results = await client.fetch(`
      *[_type == "yearPage"] {
        year,
        "projectIds": projects[]._ref
      }
    `)
    const map: Record<number, string[]> = {}
    for (const r of results) {
      if (r.year) {
        map[r.year] = r.projectIds || []
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSanityConfigured) return null

  try {
    const client = await fetchClient()
    return await client.fetch(`
      *[_type == "siteSettings" && _id == "siteSettings"][0] {
        firmName,
        address,
        email,
        phone,
        contactText
      }
    `)
  } catch {
    return null
  }
}
