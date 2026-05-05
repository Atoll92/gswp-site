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
      description: 'Glisser-déposer pour réordonner. Les projets listés ici apparaissent en premier, les autres suivent.',
    }),
    defineField({
      name: 'excludedProjects',
      title: 'Projets exclus',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Ces projets ne seront pas affichés dans cette catégorie.',
    }),
  ],
  preview: {
    select: { title: 'category.title' },
    prepare({ title }) {
      return { title: title || 'Sans catégorie' }
    },
  },
})
