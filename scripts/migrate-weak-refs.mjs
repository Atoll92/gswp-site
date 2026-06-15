import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const DRY_RUN = process.argv.includes('--dry-run')

async function convertToWeakRefs() {
  if (DRY_RUN) console.log('=== DRY RUN — no changes will be made ===\n')

  const types = ['homePage', 'categoryPage', 'yearPage']

  for (const type of types) {
    const docs = await client.fetch(
      `*[_type == $type && defined(projects)] { _id, projects }`,
      { type }
    )
    console.log(`\n=== ${type}: ${docs.length} documents ===`)

    for (const doc of docs) {
      if (!doc.projects || doc.projects.length === 0) continue

      // Only add _weak: true — no other changes
      const weakRefs = doc.projects.map((ref) => ({
        ...ref,
        _weak: true,
      }))

      const alreadyWeak = doc.projects.every((ref) => ref._weak === true)
      if (alreadyWeak) {
        console.log(`  ${doc._id}: already weak, skipping`)
        continue
      }

      if (DRY_RUN) {
        console.log(`  ${doc._id}: would convert ${weakRefs.length} refs to weak`)
      } else {
        await client.patch(doc._id).set({ projects: weakRefs }).commit()
        console.log(`  ${doc._id}: ${weakRefs.length} refs converted to weak`)
      }
    }
  }

  console.log('\nDone!')
}

convertToWeakRefs().catch(console.error)
