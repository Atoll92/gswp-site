import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
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
    `*[_type == "project" && defined(subtitle) && subtitle != ""] { _id, subtitle }`
  )

  console.log(`Found ${projects.length} projects with subtitle to check`)

  let migrated = 0
  let skipped = 0

  for (const project of projects) {
    if (Array.isArray(project.subtitle)) {
      console.log(`  Skipping ${project._id} — already Portable Text`)
      skipped++
      continue
    }

    const blocks = textToPortableText(project.subtitle)
    await client.patch(project._id).set({ subtitle: blocks }).commit()
    console.log(`  Migrated subtitle for ${project._id}`)
    migrated++
  }

  console.log(`\nDone! Migrated: ${migrated}, Skipped: ${skipped}`)
}

migrate().catch(console.error)
