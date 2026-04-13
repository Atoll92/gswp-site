import { getAboutPage, getSiteSettings } from '../../../sanity/lib/queries'
import AboutClient from './AboutClient'

export const revalidate = 0

export default async function AProposPage() {
  const [about, settings] = await Promise.all([
    getAboutPage(),
    getSiteSettings(),
  ])

  return <AboutClient about={about} settings={settings} />
}
