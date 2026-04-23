import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'categoryPage',
  title: 'Ordre par catégorie',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projects',
      title: "Projets (ordre d'affichage)",
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Glisser-déposer pour réordonner les projets dans cette catégorie.',
    }),
  ],
  preview: {
    select: { title: 'category.title' },
    prepare({ title }) {
      return { title: `Ordre: ${title || 'Sans catégorie'}` }
    },
  },
})
