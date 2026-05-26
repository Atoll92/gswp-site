import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'portfolioPage',
  title: 'Portfolio',
  type: 'document',
  fields: [
    defineField({
      name: 'pdfs',
      title: 'Documents PDF',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'file',
              title: 'Fichier PDF',
              type: 'file',
              options: {
                accept: '.pdf',
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),
  ],
})
