import { getAboutPage, getSiteSettings, getPortfolioPage } from '../../../sanity/lib/queries'
import PortfolioClient from './PortfolioClient'

export const revalidate = 0

export default async function PortfolioPageRoute() {
  const [about, settings, portfolio] = await Promise.all([
    getAboutPage(),
    getSiteSettings(),
    getPortfolioPage(),
  ])

  return <PortfolioClient settings={settings} bio={about?.bio || null} portfolio={portfolio} />
}
