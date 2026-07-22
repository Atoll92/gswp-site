import type { Metadata } from 'next'
import Script from 'next/script'
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
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
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
