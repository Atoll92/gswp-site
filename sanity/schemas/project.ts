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
      title: 'Lieu',
      type: 'string',
      description: 'e.g. "Paris, France"',
    }),
    defineField({
      name: 'country',
      title: 'Pays',
      type: 'string',
    }),
    defineField({
      name: 'venue',
      title: 'Lieu / Institution',
      type: 'string',
      description: 'e.g. "19M", "KANAL"',
    }),
    defineField({
      name: 'projectType',
      title: 'Type de projet',
      type: 'string',
      description: 'e.g. "Exhibition Scenography"',
    }),
    defineField({
      name: 'surface',
      title: 'Surface',
      type: 'string',
      description: 'e.g. "650m2"',
    }),
    defineField({
      name: 'curator',
      title: 'Commissaire / Curator',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
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
      type: 'text',
      rows: 4,
      description: 'Displayed as the last slide in the project slideshow',
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
          { title: 'Plan', value: 'plan' },
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
      description: 'Laisser vide pour un post texte seul (utilisera le champ Extrait / Sous-titre)',
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
    }),
    defineField({
      name: 'planImage',
      title: 'Plan',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Ordre',
      type: 'number',
      description: 'Ordre d\'affichage (plus petit = premier)',
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
