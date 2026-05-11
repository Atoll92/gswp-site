import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const CATEGORY_PAGES = {
  'categoryPage-theatres': 'architecture-theatres',
  'categoryPage-interieurs': 'architecture-interieurs',
  'categoryPage-expos': 'expositions',
  'categoryPage-defiles': 'defiles',
}

async function prefill() {
  // Get all categories to map slug -> _id
  const categories = await client.fetch(`*[_type == "category"] { _id, slug }`)
  const slugToId = {}
  for (const cat of categories) {
    slugToId[cat.slug.current] = cat._id
  }

  for (const [docId, slug] of Object.entries(CATEGORY_PAGES)) {
    const catId = slugToId[slug]
    if (!catId) {
      console.log(`Category "${slug}" not found, skipping`)
      continue
    }

    // Get all projects in this category, ordered
    const projects = await client.fetch(
      `*[_type == "project" && category._ref == $catId] | order(order asc, year desc) { _id }`,
      { catId }
    )

    console.log(`${slug}: ${projects.length} projects`)

    if (projects.length === 0) continue

    // Check if the categoryPage already has projects
    const existing = await client.fetch(`*[_id == $id][0] { "count": count(projects) }`, { id: docId })

    if (existing?.count > 0) {
      console.log(`  ${docId} already has ${existing.count} projects, skipping`)
      continue
    }

    const refs = projects.map((p) => ({
      _type: 'reference',
      _ref: p._id,
      _key: p._id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
    }))

    await client.patch(docId).set({ projects: refs }).commit()
    console.log(`  Pre-filled ${docId} with ${refs.length} projects`)
  }

  console.log('\nDone!')
}

prefill().catch(console.error)
