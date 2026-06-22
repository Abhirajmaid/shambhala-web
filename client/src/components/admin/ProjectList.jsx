'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { AddProjectModal } from './AddProjectModal';
import { AdminTopbar } from './AdminTopbar';
import { useProjectState } from './ProjectStateProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProjectList() {
  const { projects, loading, error, addProject, deleteProject } = useProjectState();
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchKey, setSearchKey] = useState(0);
  const filteredProjects = projects.filter((project) => {
    const value = `${project.name} ${project.category} ${project.tagline}`.toLowerCase();
    return value.includes(query.trim().toLowerCase());
  });

  async function confirmDeleteProject(project) {
    if (!window.confirm(`Delete "${project.name}" from the CMS and gallery?`)) return;
    await deleteProject(project.id);
  }

  async function handleAddProject(project) {
    await addProject(project);
    clearSearch();
  }

  function clearSearch() {
    setQuery('');
    setSearchKey((key) => key + 1);
    window.setTimeout(() => setQuery(''), 0);
  }

  function closeModal() {
    setModalOpen(false);
    clearSearch();
  }

  return (
    <section>
      <AdminTopbar
        eyebrow="Gallery CMS"
        title="Dashboard"
        description="Manage gallery project groups, categories, and image URLs from one CMS workspace."
      />

      <div className="mb-5 flex justify-end">
        <label htmlFor="project-search" className="sr-only">Search projects</label>
        <div className="relative w-full max-w-sm rounded-2xl bg-white/90 p-2 shadow-[0_14px_35px_rgba(15,23,42,0.06)] backdrop-blur">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            key={searchKey}
            id="project-search"
            name="dashboard-project-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects..."
            className="h-10 bg-white pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
          <h2 className="text-xl font-semibold text-slate-950">Loading projects...</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Fetching the latest gallery data from Firestore.</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
          <h2 className="text-xl font-semibold text-red-900">Unable to load projects</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-red-700">{error.message}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-950">No projects yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Add your first project to start organizing gallery images.</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
          <h2 className="text-xl font-semibold text-slate-950">No matching projects</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Try a different name, category, or tagline.</p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredProjects.map((project) => (
            <article key={project.id} className="grid gap-4 rounded-3xl bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)] md:grid-cols-[11rem_1fr_auto] md:items-center">
              <div className="relative h-36 overflow-hidden rounded-2xl bg-slate-100">
                {project.images[0] ? (
                  <img src={project.images[0]} alt={`${project.name} cover`} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs uppercase tracking-[0.18em] text-slate-400">No image</div>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-950">{project.name}</h2>
                  <span className="rounded-full bg-[#8a5a32]/10 px-3 py-1 text-xs font-medium text-[#8a5a32]">{project.status}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-600">{project.category}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{project.tagline}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">{project.images.length} images</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" render={<Link href={`/admin/projects/${project.id}`} />}>View</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => confirmDeleteProject(project)}
                  className="border-red-200 px-3 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800"
                  aria-label={`Delete ${project.name}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Button
        aria-label="Add project"
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-[#8a5a32] p-0 text-white shadow-xl shadow-[#8a5a32]/25 hover:bg-[#704626] focus-visible:ring-[#8a5a32]/40"
        onClick={() => setModalOpen(true)}
      >
        <Plus className="size-6" />
      </Button>

      <AddProjectModal open={modalOpen} onClose={closeModal} onAddProject={handleAddProject} />
    </section>
  );
}
