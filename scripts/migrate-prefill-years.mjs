import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function run() {
  // Get all projects grouped by year
  const projects = await client.fetch(
    `*[_type == "project" && defined(year)] | order(order asc, year desc) { _id, year }`
  )

  const byYear = {}
  for (const p of projects) {
    if (!byYear[p.year]) byYear[p.year] = []
    byYear[p.year].push(p._id)
  }

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)
  console.log(`Found ${years.length} years: ${years.join(', ')}`)

  for (const year of years) {
    const docId = `yearPage-${year}`
    const projectIds = byYear[year]

    // Check if already exists
    const existing = await client.fetch(
      `*[_id == $id][0] { "count": count(projects) }`,
      { id: docId }
    )

    if (existing?.count > 0) {
      console.log(`${docId} already has ${existing.count} projects, skipping`)
      continue
    }

    const refs = projectIds.map((id) => ({
      _type: 'reference',
      _ref: id,
      _key: id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
    }))

    if (existing) {
      // Document exists but empty, patch it
      await client.patch(docId).set({ projects: refs }).commit()
    } else {
      // Create new document
      await client.create({
        _id: docId,
        _type: 'yearPage',
        year,
        projects: refs,
      })
    }
    console.log(`${docId}: ${projectIds.length} projects`)
  }

  console.log('\nDone!')
}

run().catch(console.error)
