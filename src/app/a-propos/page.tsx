import { getAboutPage } from '../../../sanity/lib/queries'
import AboutClient from './AboutClient'

export default async function AProposPage() {
  const about = await getAboutPage()

  return <AboutClient about={about} />
}
