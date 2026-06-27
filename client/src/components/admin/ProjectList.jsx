'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, GripVertical, Plus, Search, Trash2 } from 'lucide-react';
import { AddProjectModal } from './AddProjectModal';
import { AdminTopbar } from './AdminTopbar';
import { useProjectState } from './ProjectStateProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function SortableProjectCard({ project, onDelete, disabled, rank, galleryRank }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id, disabled });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-[1.7rem] border border-white bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.13)] ${isDragging ? 'z-10 opacity-85 ring-2 ring-[#8a5a32]/30' : ''}`}
    >
      <button
        type="button"
        className={`absolute left-3 top-3 z-10 grid size-9 place-items-center rounded-full border border-white/60 bg-white/90 text-slate-400 shadow-sm backdrop-blur transition group-hover:opacity-100 group-focus-within:opacity-100 ${isDragging ? 'opacity-100' : 'opacity-0'} ${disabled ? 'cursor-not-allowed group-hover:opacity-40 group-focus-within:opacity-40' : 'cursor-grab hover:border-[#8a5a32]/40 hover:text-[#8a5a32] active:cursor-grabbing'}`}
        aria-label={`Reorder ${project.name}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="grid md:grid-cols-[13rem_1fr]">
        <div className="relative h-52 overflow-hidden bg-slate-100 md:h-full">
          {project.images[0] ? (
            <Image src={project.images[0]} alt={`${project.name} cover`} fill sizes="13rem" className="object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="grid h-full place-items-center text-xs uppercase tracking-[0.18em] text-slate-400">No image</div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm">Rank #{rank}</span>
              {project.status === 'Published' ? (
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">Gallery #{galleryRank}</span>
              ) : (
                <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">Hidden</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#8a5a32]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a5a32]">{project.status}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{project.images.length} images</span>
              </div>
              <h2 className="mt-3 truncate text-2xl font-bold tracking-tight text-slate-950">{project.name}</h2>
              <p className="mt-1 text-sm font-semibold text-[#8a5a32]">{project.category}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                aria-label={`View ${project.name}`}
                className="size-9 rounded-full p-0"
                render={<Link href={`/admin/projects/${project.id}`} />}
              >
                <Eye className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(project)}
                className="size-9 rounded-full border-red-200 p-0 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800"
                aria-label={`Delete ${project.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{project.tagline || 'No project description added yet.'}</p>
        </div>
      </div>
    </article>
  );
}

export function ProjectList() {
  const { projects, loading, error, addProject, deleteProject, updateProjectOrder } = useProjectState();
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchKey, setSearchKey] = useState(0);
  const [reordering, setReordering] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const isSearching = query.trim().length > 0;
  const galleryRanks = new Map(
    projects
      .filter((project) => project.status === 'Published')
      .map((project, index) => [project.id, index + 1])
  );
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

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id || isSearching) return;

    const oldIndex = projects.findIndex((project) => project.id === active.id);
    const newIndex = projects.findIndex((project) => project.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    setReordering(true);
    try {
      const reorderedProjects = arrayMove(projects, oldIndex, newIndex);
      await updateProjectOrder(reorderedProjects.map((project) => project.id));
    } finally {
      setReordering(false);
    }
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

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {isSearching ? 'Clear search to reorder projects.' : reordering ? 'Saving project order...' : 'Drag the handle to rank projects. Draft projects are hidden on the public gallery.'}
        </p>
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredProjects.map((project) => project.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredProjects.map((project) => (
                <SortableProjectCard
                  key={project.id}
                  project={project}
                  onDelete={confirmDeleteProject}
                  disabled={isSearching || reordering}
                  rank={projects.findIndex((item) => item.id === project.id) + 1}
                  galleryRank={galleryRanks.get(project.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
