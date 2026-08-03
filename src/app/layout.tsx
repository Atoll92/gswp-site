import type { Metadata } from 'next'
import Script from 'next/script'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '../../sanity/lib/live'
import { DisableDraftMode } from '@/components/DisableDraftMode'
import './globals.css'

export const metadata: Metadata = {
  title: 'Georgi Stanishev & William Parlon',
  description: 'george.william is an architecture and scenography studio founded in Paris in 2014. Its activities cover the fields of architecture, exhibition, set design, installations, teaching in France and abroad.',
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
