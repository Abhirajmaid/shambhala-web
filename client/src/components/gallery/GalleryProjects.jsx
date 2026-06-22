'use client';

import { useEffect, useState } from 'react';
import { subscribeToProjects } from '@/lib/projects';
import { ProjectScrollSection } from './ProjectScrollSection';

export function GalleryProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    return subscribeToProjects({ publishedOnly: true }, (items) => {
      setProjects(items);
      setLoading(false);
      setError(null);
    }, (err) => {
      setError(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#fffaf3] py-16 text-center text-sm text-muted-foreground">
        Loading gallery projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#fffaf3] py-16 text-center text-sm text-red-700">
        Unable to load gallery projects: {error.message}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-[#fffaf3] py-16 text-center text-sm text-muted-foreground">
        No published gallery projects yet.
      </div>
    );
  }

  return projects.map((project, index) => (
    <ProjectScrollSection key={project.id} project={project} index={index} />
  ));
}
