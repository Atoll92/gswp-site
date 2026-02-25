import { getSiteSettings } from '../../../sanity/lib/queries'
import ContactClient from './ContactClient'

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return <ContactClient settings={settings} />
}
