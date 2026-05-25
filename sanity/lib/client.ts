import { createClient, type SanityClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const isSanityConfigured =
  !!projectId && projectId !== 'your_project_id' && /^[a-z0-9-]+$/.test(projectId)

let _client: SanityClient | null = null

export function getClient(preview = false): SanityClient {
  if (preview) {
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: 'previewDrafts',
    })
  }
  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    })
  }
  return _client
}

// Keep backward compat — only access .client if actually configured
export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false })
  : (null as unknown as SanityClient)
