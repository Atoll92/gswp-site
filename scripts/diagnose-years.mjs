import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function run() {
  const projects = await client.fetch(`*[_type == "project"] { _id, title, year }`)
  const byYear = {}
  for (const p of projects) {
    const y = p.year || 0
    if (!byYear[y]) byYear[y] = 0
    byYear[y]++
  }
  const years = Object.keys(byYear).map(Number).filter(y => y > 0).sort((a, b) => b - a)
  console.log('Years with projects:')
  for (const y of years) console.log(`  ${y}: ${byYear[y]} projects`)

  const yearPages = await client.fetch(`*[_type == "yearPage" && !(_id in path("drafts.**"))] { _id, year, "count": count(projects) }`)
  const ypYears = yearPages.map(yp => yp.year).sort((a, b) => b - a)
  console.log('\nExisting yearPage docs:', ypYears.join(', '))

  const missing = years.filter(y => !ypYears.includes(y))
  console.log('\nMissing yearPage docs:', missing.length > 0 ? missing.join(', ') : 'none')

  // Check hardcoded list in structure.ts
  const hardcoded = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2017, 2016, 2015, 2014, 2012, 2011]
  const missingFromStructure = years.filter(y => !hardcoded.includes(y))
  console.log('\nMissing from Studio structure (hardcoded):', missingFromStructure.length > 0 ? missingFromStructure.join(', ') : 'none')
}

run().catch(console.error)
