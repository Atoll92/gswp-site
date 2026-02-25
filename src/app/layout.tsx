import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Georgi Stanishev & William Parlon',
  description: 'Atelier Architecture Scénographie — Paris',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
