'use client';

import { useParams } from 'next/navigation';
import { ProjectDetail } from '@/components/admin/ProjectDetail';

export default function ProjectDetailPage() {
  const { id } = useParams();
  return <ProjectDetail projectId={id} />;
}
