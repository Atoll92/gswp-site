import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN || 'sk8kXAdeMH3kpF0KWPh0fdF6GaL5PkyRD1ENXzGM4GkllBKy10REmMG65GIwfFY0RqjeebBdflEJxLnz5LLzdxhJ0MPVw9DKKxjy7zXJVk5UTwfJ7phe1K1emmBZ09NKMMqeixsZBGbpwqvYWLynRTTjFyh2NTWfCsH6M6lE0GLqpbuw4hla',
})

async function cleanupPlanTags() {
  console.log('--- Removing "plan" tags from projects ---')
  const projects = await client.fetch(
    `*[_type == "project" && "plan" in tags] { _id, tags }`
  )
  console.log(`Found ${projects.length} projects with "plan" tag`)

  for (const project of projects) {
    const newTags = project.tags.filter((t) => t !== 'plan')
    await client.patch(project._id).set({ tags: newTags }).commit()
    console.log(`  Cleaned tags for ${project._id}`)
  }
}

async function createCategoryPages() {
  console.log('\n--- Creating category page documents ---')

  // Fetch category IDs
  const categories = await client.fetch(`*[_type == "category"] { _id, title, slug }`)
  console.log(`Found categories:`, categories.map((c) => `${c.title} (${c.slug.current})`))

  const mapping = {
    'categoryPage-theatres': 'architecture-theatres',
    'categoryPage-interieurs': 'architecture-interieurs',
    'categoryPage-expos': 'expositions',
    'categoryPage-defiles': 'defiles',
  }

  for (const [docId, slug] of Object.entries(mapping)) {
    const cat = categories.find((c) => c.slug.current === slug)
    if (!cat) {
      console.log(`  WARNING: Category with slug "${slug}" not found, skipping ${docId}`)
      continue
    }

    // Check if document already exists
    const existing = await client.fetch(`*[_id == $id][0]`, { id: docId })
    if (existing) {
      console.log(`  ${docId} already exists, skipping`)
      continue
    }

    await client.create({
      _id: docId,
      _type: 'categoryPage',
      category: { _type: 'reference', _ref: cat._id },
      projects: [],
      excludedProjects: [],
    })
    console.log(`  Created ${docId} → ${cat.title}`)
  }
}

async function run() {
  await cleanupPlanTags()
  await createCategoryPages()
  console.log('\nDone!')
}

run().catch(console.error)
