import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function diagnose() {
  // 1. All categories
  const categories = await client.fetch(`*[_type == "category"] { _id, title, slug }`)
  console.log('=== CATEGORIES ===')
  for (const c of categories) {
    console.log(`  _id: ${c._id}  slug: ${c.slug.current}  title: ${c.title}`)
  }

  // 2. All categoryPage documents
  const pages = await client.fetch(`
    *[_type == "categoryPage"] {
      _id,
      "catRef": category._ref,
      "catSlug": category->slug.current,
      "catTitle": category->title,
      "projectCount": count(projects)
    }
  `)
  console.log('\n=== CATEGORY PAGES ===')
  for (const p of pages) {
    console.log(`  _id: ${p._id}  catRef: ${p.catRef}  catSlug: ${p.catSlug}  catTitle: ${p.catTitle}  projects: ${p.projectCount}`)
  }

  // 3. Projects per category (by dereferenced slug)
  const projectCounts = await client.fetch(`
    {
      "byCat": *[_type == "project"] {
        "catSlug": category->slug.current,
        "catRef": category._ref
      }
    }
  `)
  const countMap = {}
  const refMap = {}
  for (const p of projectCounts.byCat) {
    const slug = p.catSlug || '(no category)'
    countMap[slug] = (countMap[slug] || 0) + 1
    if (!refMap[slug]) refMap[slug] = p.catRef
  }
  console.log('\n=== PROJECTS PER CATEGORY ===')
  for (const [slug, count] of Object.entries(countMap)) {
    console.log(`  ${slug}: ${count} projects (ref: ${refMap[slug]})`)
  }
}

diagnose().catch(console.error)
