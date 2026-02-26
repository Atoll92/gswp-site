export interface Project {
  _id: string
  title: string
  slug: { current: string }
  category: Category | null
  year: number
  location: string
  country: string
  venue: string
  projectType: string
  surface: string
  curator: string
  description: string
  coverImage: SanityImage
  images: SanityImage[]
  planImage: SanityImage | null
  order: number
  // Local images for sample data (before Sanity is populated)
  localCover?: string
  localImages?: string[]
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  order: number
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  alt?: string
}

export interface AboutPage {
  content: any[]
  images: SanityImage[]
}

export interface JournalPost {
  _id: string
  title: string
  slug: { current: string }
  date: string
  content: any[]
  coverImage: SanityImage
}

export interface SiteSettings {
  firmName: string
  address: string
  email: string
  phone: string
}

export type ViewMode = 'aleatoire' | 'chronologique' | 'projets'
