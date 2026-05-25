'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()

  if (isPresentationTool) return null

  return (
    <a
      href="/api/draft-mode/disable"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999,
        background: '#333',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '2rem',
        fontSize: '0.8rem',
        textDecoration: 'none',
      }}
    >
      Quitter le mode brouillon
    </a>
  )
}
