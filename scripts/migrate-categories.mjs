import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function migrate() {
  console.log('Migrating categories...\n')

  // 1. Rename kept categories (keep slugs intact so project references stay valid)
  const renames = [
    { slug: 'architecture-theatres', newTitle: 'Theaters', order: 1 },
    { slug: 'architecture-interieurs', newTitle: 'Architectures', order: 2 },
    { slug: 'expositions', newTitle: 'Expos', order: 3 },
    { slug: 'defiles', newTitle: 'Shows', order: 4 },
  ]

  for (const { slug, newTitle, order } of renames) {
    const existing = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug }
    )
    if (existing) {
      await client.patch(existing._id).set({ title: newTitle, order }).commit()
      console.log(`  Renamed "${existing.title}" -> "${newTitle}" (slug: ${slug})`)
    } else {
      console.log(`  WARNING: Category with slug "${slug}" not found, creating it...`)
      await client.createOrReplace({
        _id: `category-${slug}`,
        _type: 'category',
        title: newTitle,
        slug: { _type: 'slug', current: slug },
        order,
      })
      console.log(`  Created "${newTitle}" (slug: ${slug})`)
    }
  }

  // 2. Delete unused categories
  const toDelete = ['celebrations', 'scenographie-de-theatre', 'scenographie-theatre', 'showroom']

  console.log('\nRemoving unused categories...')
  for (const slug of toDelete) {
    const existing = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug }
    )
    if (existing) {
      // Check if any projects still reference this category
      const projectCount = await client.fetch(
        `count(*[_type == "project" && category._ref == $id])`,
        { id: existing._id }
      )
      if (projectCount > 0) {
        console.log(`  WARNING: "${existing.title}" has ${projectCount} project(s) — removing category reference from them first`)
        await client
          .patch({ query: `*[_type == "project" && category._ref == "${existing._id}"]` })
          .unset(['category'])
          .commit()
      }
      await client.delete(existing._id)
      console.log(`  Deleted "${existing.title}" (slug: ${slug})`)
    } else {
      console.log(`  Skipped "${slug}" — not found`)
    }
  }

  console.log('\nDone! Categories migrated.')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
