import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const DRY_RUN = process.argv.includes('--dry-run')

async function run() {
  if (DRY_RUN) console.log('=== DRY RUN ===\n')

  // Get all projects grouped by year
  const projects = await client.fetch(
    `*[_type == "project" && defined(year)] | order(order asc, year desc) { _id, title, year }`
  )
  const byYear = {}
  for (const p of projects) {
    if (!byYear[p.year]) byYear[p.year] = []
    byYear[p.year].push(p._id)
  }

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)
  console.log(`Projects span ${years.length} years: ${years.join(', ')}\n`)

  // Get existing yearPage docs
  const existingPages = await client.fetch(
    `*[_type == "yearPage" && !(_id in path("drafts.**"))] { _id, year, projects }`
  )
  const pageMap = {}
  for (const p of existingPages) pageMap[p.year] = p

  for (const year of years) {
    const docId = `yearPage-${year}`
    const actualIds = byYear[year]
    const existing = pageMap[year]

    if (!existing) {
      // Create new yearPage
      const refs = actualIds.map(id => ({
        _type: 'reference',
        _ref: id,
        _key: id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
        _weak: true,
      }))
      console.log(`${docId}: CREATE with ${refs.length} projects`)
      if (!DRY_RUN) {
        await client.create({ _id: docId, _type: 'yearPage', year, projects: refs })
      }
    } else {
      // Sync: keep order, remove stale, append missing
      const currentIds = (existing.projects || []).map(r => r._ref)
      const validOrdered = currentIds.filter(id => actualIds.includes(id))
      const missing = actualIds.filter(id => !currentIds.includes(id))
      const stale = currentIds.filter(id => !actualIds.includes(id))
      const finalIds = [...validOrdered, ...missing]

      if (stale.length === 0 && missing.length === 0) {
        console.log(`${docId}: OK (${currentIds.length} projects)`)
        continue
      }

      console.log(`${docId}: ${currentIds.length} → ${finalIds.length} (removed ${stale.length} stale, added ${missing.length} missing)`)
      if (!DRY_RUN) {
        const refs = finalIds.map(id => ({
          _type: 'reference',
          _ref: id,
          _key: id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
          _weak: true,
        }))
        await client.patch(existing._id).set({ projects: refs }).commit()
      }
    }
  }

  console.log('\nDone!')
}

run().catch(console.error)
