import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'À Propos',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Bio / Atelier (panneau header)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Short bio shown in the info panel when clicking the firm name',
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
      of: [{ type: 'block' }],
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
  ],
})
