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
      S.divider(),
      S.listItem()
        .title('Ordre des projets')
        .child(
          S.list()
            .title('Ordre des projets')
            .items([
              S.listItem()
                .title("Page d'accueil")
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                ),
              S.divider(),
              S.listItem()
                .title('Par catégorie')
                .child(
                  S.list()
                    .title('Par catégorie')
                    .items([
                      S.listItem()
                        .title('Architecture & Théâtres')
                        .child(
                          S.document()
                            .schemaType('categoryPage')
                            .documentId('categoryPage-theatres')
                        ),
                      S.listItem()
                        .title('Architecture & Intérieurs')
                        .child(
                          S.document()
                            .schemaType('categoryPage')
                            .documentId('categoryPage-interieurs')
                        ),
                      S.listItem()
                        .title('Expositions')
                        .child(
                          S.document()
                            .schemaType('categoryPage')
                            .documentId('categoryPage-expos')
                        ),
                      S.listItem()
                        .title('Défilés')
                        .child(
                          S.document()
                            .schemaType('categoryPage')
                            .documentId('categoryPage-defiles')
                        ),
                    ])
                ),
              S.divider(),
              S.listItem()
                .title('Par année (Timeline)')
                .child(
                  S.list()
                    .title('Par année')
                    .items(
                      [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2017, 2016, 2015, 2014, 2012, 2011].map((year) =>
                        S.listItem()
                          .title(String(year))
                          .child(
                            S.document()
                              .schemaType('yearPage')
                              .documentId(`yearPage-${year}`)
                          )
                      )
                    )
                ),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('journalPost').title('Journal'),
    ])
