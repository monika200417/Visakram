import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../components/layout/PlaceholderPage'
import { getProjectBySlug } from '../data/projects'
import { NotFoundPage } from './NotFoundPage'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) return <NotFoundPage />

  return <PlaceholderPage title={project.name} milestone="Milestone 6" />
}
