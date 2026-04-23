export interface Project {
  _id: string
  title: string
  slug: { current: string }
  category: Category | null
  year: number
  location: string
  country: string
  venue: string
  subtitle: string
  credits: any[]
  tags: string[]
  coverImage: SanityImage
  images: SanityImage[]
  displaySize?: number
  linkedProjectIds?: string[]
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
  caption?: string
}

export interface AboutPage {
  bio?: any[]
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

export type ViewMode = 'home' | 'chronologique' | 'typologique' | string
