import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN || 'sk8kXAdeMH3kpF0KWPh0fdF6GaL5PkyRD1ENXzGM4GkllBKy10REmMG65GIwfFY0RqjeebBdflEJxLnz5LLzdxhJ0MPVw9DKKxjy7zXJVk5UTwfJ7phe1K1emmBZ09NKMMqeixsZBGbpwqvYWLynRTTjFyh2NTWfCsH6M6lE0GLqpbuw4hla',
})

function textToPortableText(text) {
  if (!text) return []
  return text.split('\n').filter(Boolean).map((line, i) => ({
    _type: 'block',
    _key: `block-${i}`,
    style: 'normal',
    markDefs: [],
    children: [{
      _type: 'span',
      _key: `span-${i}`,
      text: line,
      marks: [],
    }],
  }))
}

async function migrate() {
  const projects = await client.fetch(
    `*[_type == "project" && defined(credits) && credits != ""] { _id, credits }`
  )

  console.log(`Found ${projects.length} projects with credits to migrate`)

  let migrated = 0
  let skipped = 0

  for (const project of projects) {
    // Skip if already converted to array (Portable Text)
    if (Array.isArray(project.credits)) {
      console.log(`  Skipping ${project._id} — already Portable Text`)
      skipped++
      continue
    }

    const blocks = textToPortableText(project.credits)
    await client.patch(project._id).set({ credits: blocks }).commit()
    console.log(`  Migrated credits for ${project._id}`)
    migrated++
  }

  console.log(`\nDone! Migrated: ${migrated}, Skipped: ${skipped}`)
}

migrate().catch(console.error)
