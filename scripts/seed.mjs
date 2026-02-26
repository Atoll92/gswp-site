import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const client = createClient({
  projectId: 'tytcgawz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const imagesDir = resolve(process.cwd(), 'public/images/projects')

async function uploadImage(filename, key) {
  const filepath = resolve(imagesDir, filename)
  const buffer = readFileSync(filepath)
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  })
  console.log(`  Uploaded ${filename} -> ${asset._id}`)
  return { _type: 'image', _key: key, asset: { _type: 'reference', _ref: asset._id } }
}

async function seed() {
  console.log('Seeding Sanity...\n')

  // 1. Create categories
  console.log('Creating categories...')
  const categoryData = [
    { title: 'Architecture [Théâtres]', order: 1 },
    { title: 'Architecture [Intérieurs]', order: 2 },
    { title: 'Expositions', order: 3 },
    { title: 'Défilés', order: 4 },
    { title: 'Célébrations', order: 5 },
    { title: 'Scénographie de théâtre', order: 6 },
    { title: 'Showroom', order: 7 },
  ]

  const categories = {}
  for (const cat of categoryData) {
    const slug = cat.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\[|\]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const doc = await client.createOrReplace({
      _id: `category-${slug}`,
      _type: 'category',
      title: cat.title,
      slug: { _type: 'slug', current: slug },
      order: cat.order,
    })
    categories[cat.title] = doc._id
    console.log(`  ${cat.title} -> ${doc._id}`)
  }

  // 2. Upload images and create projects
  console.log('\nUploading images & creating projects...')

  const projects = [
    {
      _id: 'project-figure-libre',
      title: 'Figure Libre',
      slug: 'figure-libre',
      category: 'Expositions',
      year: 2024,
      location: 'Paris, France',
      country: 'FRANCE',
      venue: '19M',
      projectType: 'Exhibition Scenography',
      surface: '650m2',
      curator: 'Stéphane Ashpool, Méryl Laurent',
      description: `Figure Libre invites visitors to discover how sportswear can be an art form, an approach that is not only technical—responding to the body's urgent need to move with ease in pursuit of performance—but also a visual celebration that honors the body through the choice of fabrics, textiles, and embellishments that celebrate prowess.

Conceived as a flexible, adaptable, technical, organic, woven, visual, and typological field of exploration, the installation follows Stéphane Ashpool's creative journey through his work and collaborations with the crafts of 19m. It takes the shape of an arena relating the themes of a super modern and intemporal architecture, a sports stadium and a performance stage.`,
      coverFile: 'figure-libre-1.jpg',
      imageFiles: ['figure-libre-2.jpg', 'figure-libre-3.jpg', 'figure-libre-4.jpg', 'axo.jpg'],
      order: 1,
    },
    {
      _id: 'project-the-wall',
      title: 'The Wall',
      slug: 'the-wall',
      category: 'Architecture [Théâtres]',
      year: 2024,
      location: 'Logroño, Spain',
      country: 'SPAIN',
      venue: 'CONCENTRICO',
      projectType: 'Installation',
      surface: '',
      curator: '',
      description: '',
      coverFile: 'the-wall.jpg',
      imageFiles: ['the-wall-2.jpg'],
      order: 2,
    },
    {
      _id: 'project-culture-market',
      title: 'Culture Market',
      slug: 'culture-market',
      category: 'Expositions',
      year: 2024,
      location: 'Brussels, Belgium',
      country: 'BELGIUM',
      venue: 'KANAL',
      projectType: 'Exhibition Scenography',
      surface: '',
      curator: '',
      description: '',
      coverFile: 'culture-market.jpg',
      imageFiles: [],
      order: 3,
    },
    {
      _id: 'project-hermes-fw25',
      title: 'Hermès FW25 Shanghai',
      slug: 'hermes-fw25-shanghai',
      category: 'Défilés',
      year: 2025,
      location: 'Shanghai, China',
      country: 'CHINA',
      venue: 'Hermès',
      projectType: 'Fashion Show',
      surface: '',
      curator: '',
      description: '',
      coverFile: 'hermes-1.jpg',
      imageFiles: ['hermes-2.jpg'],
      order: 4,
    },
    {
      _id: 'project-ball-theater',
      title: 'Ball Theater',
      slug: 'ball-theater',
      category: 'Architecture [Théâtres]',
      year: 2023,
      location: 'Paris, France',
      country: 'FRANCE',
      venue: '',
      projectType: 'Architecture',
      surface: '',
      curator: '',
      description: '',
      coverFile: 'ball-theater.jpg',
      imageFiles: [],
      order: 5,
    },
    {
      _id: 'project-les-portes',
      title: 'Les Portes du possible',
      slug: 'les-portes-du-possible',
      category: 'Expositions',
      year: 2024,
      location: 'Paris, France',
      country: 'FRANCE',
      venue: '',
      projectType: 'Exhibition',
      surface: '',
      curator: '',
      description: '',
      coverFile: 'les-portes.jpg',
      imageFiles: ['crop.jpg'],
      order: 6,
    },
  ]

  for (const p of projects) {
    console.log(`\n  ${p.title}:`)
    const coverImage = await uploadImage(p.coverFile, 'cover')
    const images = []
    for (let i = 0; i < p.imageFiles.length; i++) {
      const img = await uploadImage(p.imageFiles[i], `img-${i}`)
      images.push(img)
    }

    await client.createOrReplace({
      _id: p._id,
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: { _type: 'reference', _ref: categories[p.category] },
      year: p.year,
      location: p.location,
      country: p.country,
      venue: p.venue,
      projectType: p.projectType,
      surface: p.surface,
      curator: p.curator,
      description: p.description,
      coverImage,
      images,
      order: p.order,
    })
    console.log(`  -> Created ${p.title}`)
  }

  // 3. Create site settings
  console.log('\nCreating site settings...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    firmName: 'Georgi Stanishev & William Parlon',
    address: '16 rue Léopold Bellan\n75002 Paris',
    email: 'contact@gswp.fr',
    phone: '',
  })

  // 4. Create about page
  console.log('Creating about page...')
  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    content: [
      {
        _type: 'block',
        _key: 'about1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'about1span',
            text: 'Georgi Stanishev & William Parlon fondent leur atelier en 2020 à Paris. Leur pratique mêle architecture, scénographie et design spatial à travers des projets d\'exposition, des défilés de mode, des intérieurs et des installations.',
            marks: [],
          },
        ],
      },
    ],
    images: [],
  })

  console.log('\nDone! All data seeded.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
