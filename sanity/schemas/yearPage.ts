import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'yearPage',
  title: 'Ordre par année',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Année',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projects',
      title: "Projets (ordre d'affichage)",
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Tous les projets de cette année. Glisser-déposer pour réordonner, supprimer pour masquer.',
    }),
  ],
  preview: {
    select: { title: 'year' },
    prepare({ title }) {
      return { title: title ? String(title) : 'Sans année' }
    },
  },
})
