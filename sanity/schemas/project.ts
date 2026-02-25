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
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
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
