import { isSanityConfigured, getClient } from './client'
import type { Project, Category, AboutPage, JournalPost, SiteSettings } from '@/lib/types'
import { sampleProjects, sampleCategories } from '@/lib/sampleData'

export async function getProjects(): Promise<Project[]> {
  if (!isSanityConfigured) return sampleProjects

  try {
    const results = await getClient().fetch(`
      *[_type == "project"] | order(order asc, year desc) {
        _id,
        title,
        slug,
        category->{_id, title, slug, order},
        year,
        location,
        country,
        venue,
        projectType,
        surface,
        curator,
        description,
        coverImage,
        images,
        planImage,
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
    const result = await getClient().fetch(`
      *[_type == "project" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        category->{_id, title, slug, order},
        year,
        location,
        country,
        venue,
        projectType,
        surface,
        curator,
        description,
        coverImage,
        images,
        planImage,
        order
      }
    `, { slug })
    return result || sampleProjects.find((p) => p.slug.current === slug) || null
  } catch {
    return sampleProjects.find((p) => p.slug.current === slug) || null
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return sampleCategories

  try {
    const results = await getClient().fetch(`
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

export async function getAboutPage(): Promise<AboutPage | null> {
  if (!isSanityConfigured) return null

  try {
    return await getClient().fetch(`
      *[_type == "aboutPage" && _id == "aboutPage"][0] {
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
    return await getClient().fetch(`
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

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSanityConfigured) return null

  try {
    return await getClient().fetch(`
      *[_type == "siteSettings" && _id == "siteSettings"][0] {
        firmName,
        address,
        email,
        phone
      }
    `)
  } catch {
    return null
  }
}
