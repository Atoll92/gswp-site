import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

// Fields removed from the project schema that may still have data
const FIELDS_TO_REMOVE = ['projectType', 'surface', 'curator', 'description', 'planImage', 'linkedProjects']

async function cleanupFields() {
  console.log('--- Removing legacy fields from all projects ---')

  // Fetch all projects that have any of these fields
  const query = `*[_type == "project" && (
    defined(projectType) || defined(surface) || defined(curator) ||
    defined(description) || defined(planImage) || defined(linkedProjects)
  )] { _id, projectType, surface, curator, description, planImage, linkedProjects }`

  const projects = await client.fetch(query)
  console.log(`Found ${projects.length} projects with legacy fields`)

  for (const project of projects) {
    const fieldsPresent = FIELDS_TO_REMOVE.filter((f) => project[f] != null)
    if (fieldsPresent.length === 0) continue

    const patch = client.patch(project._id)
    for (const field of fieldsPresent) {
      patch.unset([field])
    }
    await patch.commit()
    console.log(`  Cleaned ${project._id}: removed ${fieldsPresent.join(', ')}`)
  }
}

async function fixSubtitles() {
  console.log('\n--- Fixing any remaining string subtitles ---')

  // Sanity stores the old string value; check for non-array subtitles
  const projects = await client.fetch(
    `*[_type == "project" && defined(subtitle) && !is_array(subtitle)] { _id, subtitle }`
  )
  console.log(`Found ${projects.length} projects with string subtitles to fix`)

  for (const project of projects) {
    if (typeof project.subtitle !== 'string') continue
    const blocks = project.subtitle.split('\n').filter(Boolean).map((line, i) => ({
      _type: 'block',
      _key: `block-${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `span-${i}`, text: line, marks: [] }],
    }))
    await client.patch(project._id).set({ subtitle: blocks }).commit()
    console.log(`  Converted subtitle for ${project._id}`)
  }
}

async function run() {
  await cleanupFields()
  await fixSubtitles()
  console.log('\nDone!')
}

run().catch(console.error)
