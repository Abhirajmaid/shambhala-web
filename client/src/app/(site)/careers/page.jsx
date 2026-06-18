import { JobApplyForm } from '@/components/forms/JobApplyForm';
import { SectionHeader } from '@/components/sections/ContentSections';
import { Card, CardContent } from '@/components/ui/card';
import { getPublicList } from '@/lib/firebase/server-data';

export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await getPublicList('jobs');
  return <main className="container-page py-16"><SectionHeader eyebrow="Careers" title="Build beautiful homes with us" /><div className="grid gap-6">{jobs.map((job) => <Card key={job.id}><CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_420px]"><div><h2 className="text-2xl font-semibold">{job.title}</h2><p className="mt-2 text-muted-foreground">{job.location} � {job.type}</p><p className="mt-4">{job.description}</p></div><JobApplyForm jobId={job.id} /></CardContent></Card>)}</div></main>;
}
