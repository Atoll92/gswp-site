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
      description: 'Seuls les projets listés ici apparaissent dans cette catégorie. Glisser-déposer pour réordonner.',
    }),
  ],
  preview: {
    select: { title: 'category.title' },
    prepare({ title }) {
      return { title: title || 'Sans catégorie' }
    },
  },
})
