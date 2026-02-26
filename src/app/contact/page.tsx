import { getSiteSettings } from '../../../sanity/lib/queries'
import ContactClient from './ContactClient'

export const revalidate = 0

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return <ContactClient settings={settings} />
}
