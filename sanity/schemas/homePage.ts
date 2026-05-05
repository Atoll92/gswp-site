import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  fields: [
    defineField({
      name: 'projects',
      title: "Projets (ordre d'affichage)",
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      description: 'Glisser-déposer pour réordonner. Les projets listés ici apparaissent en premier, les autres suivent.',
    }),
    defineField({
      name: 'excludedProjects',
      title: 'Projets exclus',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      description: 'Ces projets ne seront pas affichés sur la page d\'accueil.',
    }),
  ],
  preview: {
    prepare() {
      return { title: "Page d'accueil" }
    },
  },
})
