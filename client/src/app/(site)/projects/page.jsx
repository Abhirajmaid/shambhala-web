import { ProjectCard, SectionHeader } from '@/components/sections/ContentSections';
import { getPublicList } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getPublicList('projects');
  return <main className="container-page py-16"><SectionHeader eyebrow="Projects" title="Recent Shambhala homes" /><div className="grid gap-5 md:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></main>;
}
