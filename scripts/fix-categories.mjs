import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function fix() {
  // 1. Pre-fill theaters with its 14 projects
  console.log('=== Fix 1: Pre-fill Architecture & Théâtres ===')
  const theatresCatId = 'category-architecture-theatres'
  const theatresProjects = await client.fetch(
    `*[_type == "project" && category._ref == $catId] | order(order asc, year desc) { _id }`,
    { catId: theatresCatId }
  )
  console.log(`Found ${theatresProjects.length} theatre projects`)

  if (theatresProjects.length > 0) {
    const refs = theatresProjects.map((p) => ({
      _type: 'reference',
      _ref: p._id,
      _key: p._id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
    }))
    await client.patch('categoryPage-theatres').set({ projects: refs }).commit()
    console.log(`Pre-filled categoryPage-theatres with ${refs.length} projects`)
  }

  // 2. Delete the expos draft that overrides the published version
  console.log('\n=== Fix 2: Remove expos draft ===')
  try {
    await client.delete('drafts.categoryPage-expos')
    console.log('Deleted drafts.categoryPage-expos')
  } catch (e) {
    console.log('Could not delete expos draft:', e.message)
  }

  // 3. Delete stray draft categoryPage
  console.log('\n=== Fix 3: Remove stray draft ===')
  try {
    await client.delete('drafts.e685b6f5-48b4-4fd6-a1c7-9703c52917e7')
    console.log('Deleted stray draft')
  } catch (e) {
    console.log('Could not delete stray draft:', e.message)
  }

  // Verify
  console.log('\n=== Verification ===')
  const pages = await client.fetch(`
    *[_type == "categoryPage"] {
      _id,
      "catSlug": category->slug.current,
      "projectCount": count(projects)
    }
  `)
  for (const p of pages) {
    console.log(`  ${p._id}: ${p.catSlug} → ${p.projectCount} projects`)
  }

  console.log('\nDone!')
}

fix().catch(console.error)
