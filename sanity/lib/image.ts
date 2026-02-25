import imageUrlBuilder from '@sanity/image-url'
import { isSanityConfigured, getClient } from './client'
import type { SanityImage } from '@/lib/types'

let builder: ReturnType<typeof imageUrlBuilder> | null = null

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
