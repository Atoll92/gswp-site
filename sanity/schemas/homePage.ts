import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  fields: [
    defineField({
      name: 'projects',
      title: 'Projets (ordre d\'affichage)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      description: 'Glisser-déposer pour réordonner. Laisser vide pour afficher tous les projets aléatoirement.',
    }),
  ],
  preview: {
    prepare() {
      return { title: "Page d'accueil" }
    },
  },
})
