import { getAboutPage, getSiteSettings } from '../../../sanity/lib/queries'
import ContactClient from './ContactClient'

export const revalidate = 0

export default async function ContactPage() {
  const [about, settings] = await Promise.all([
    getAboutPage(),
    getSiteSettings(),
  ])

  return <ContactClient settings={settings} bio={about?.bio || null} />
}
