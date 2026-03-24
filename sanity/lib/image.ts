import imageUrlBuilder from '@sanity/image-url'
import { isSanityConfigured, getClient } from './client'
import type { SanityImage } from '@/lib/types'

let builder: ReturnType<typeof imageUrlBuilder> | null = null

export function getImageDimensions(ref: string): { width: number; height: number } | null {
  const match = ref.match(/-(\d+)x(\d+)-/)
  if (!match) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}

export function urlFor(source: SanityImage) {
  if (!builder && isSanityConfigured) {
    builder = imageUrlBuilder(getClient())
  }
  if (!builder) {
    // Return a dummy builder that returns empty string
    return {
      width: () => ({ height: () => ({ url: () => '' }), url: () => '' }),
      height: () => ({ url: () => '' }),
      url: () => '',
    } as unknown as ReturnType<ReturnType<typeof imageUrlBuilder>['image']>
  }
  return builder.image(source)
}
