import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'À Propos',
  type: 'document',
  fields: [
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
