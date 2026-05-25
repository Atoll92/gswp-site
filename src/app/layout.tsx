import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '../../sanity/lib/live'
import { DisableDraftMode } from '@/components/DisableDraftMode'
import './globals.css'

export const metadata: Metadata = {
  title: 'Georgi Stanishev & William Parlon',
  description: 'Atelier Architecture Scénographie — Paris',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  )
}
