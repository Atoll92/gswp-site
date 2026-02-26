import { notFound } from 'next/navigation'
import { getProject, getProjects } from '../../../../sanity/lib/queries'
import ProjectDetailClient from './ProjectDetailClient'

export const revalidate = 0
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug.current }))
}

export default async function ProjetPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  return <ProjectDetailClient project={project} />
}
