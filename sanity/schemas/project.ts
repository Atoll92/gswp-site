import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Ville',
      type: 'string',
      description: 'e.g. "Paris"',
    }),
    defineField({
      name: 'country',
      title: 'Pays',
      type: 'string',
      description: 'e.g. "France"',
    }),
    defineField({
      name: 'venue',
      title: 'Institution',
      type: 'string',
      description: 'e.g. "19M", "KANAL"',
    }),
    defineField({
      name: 'subtitle',
      title: 'Extrait / Sous-titre',
      type: 'string',
      description: 'Large text displayed near the project in the grid',
    }),
    defineField({
      name: 'credits',
      title: 'Crédits / Collaboration',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text credits displayed as the last slide. Include collaboration details, photographer credits, etc.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags typologiques',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Model', value: 'model' },
          { title: 'Sketch', value: 'sketch' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Photography', value: 'photography' },
          { title: 'Drawing', value: 'drawing' },
        ],
      },
      description: 'Used for the Typological view grouping',
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
      description: 'Laisser vide pour un post texte seul (utilisera Extrait ou Description)',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Texte alternatif',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Légende',
              type: 'string',
              description: 'Caption shown on hover (vertical text)',
            },
          ],
        },
      ],
      description: 'Convention de nommage: [slug]-01.jpg, [slug]-02.jpg, etc.',
    }),
    defineField({
      name: 'displaySize',
      title: "Taille d'affichage (%)",
      type: 'number',
      initialValue: 100,
      validation: (Rule) => Rule.min(50).max(200),
      description: 'Pourcentage de la largeur standard (100 = normal, 50 = petit, 150 = grand)',
    }),
    defineField({
      name: 'linkedProjects',
      title: 'Projets liés',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Projects that should appear adjacent in the grid',
    }),
    defineField({
      name: 'order',
      title: 'Ordre',
      type: 'number',
      description: "Ordre d'affichage (plus petit = premier)",
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'coverImage',
    },
  },
  orderings: [
    {
      title: 'Year (desc)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
