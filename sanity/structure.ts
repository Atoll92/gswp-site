import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Paramètres du site')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.listItem()
        .title('À Propos')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
        ),
      S.divider(),
      S.documentTypeListItem('project').title('Projets'),
      S.documentTypeListItem('category').title('Catégories'),
      S.documentTypeListItem('journalPost').title('Journal'),
    ])
