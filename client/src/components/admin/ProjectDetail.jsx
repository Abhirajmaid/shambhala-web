'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Pencil, Trash2, X } from 'lucide-react';
import { AdminTopbar } from './AdminTopbar';
import { ImageDropzone } from './ImageDropzone';
import { useProjectState } from './ProjectStateProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { subscribeToProject } from '@/lib/projects';

export function ProjectDetail({ projectId }) {
  const router = useRouter();
  const { updateProject, addProjectImages, removeProjectImage, deleteProject } = useProjectState();
  const [projectState, setProjectState] = useState({ id: projectId, project: null, loading: true, error: null });
  const [form, setForm] = useState({ name: '', category: '', tagline: '', status: 'Draft', carouselRows: 2 });
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const editingRef = useRef(false);

  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  useEffect(() => {
    return subscribeToProject(projectId, (item) => {
      setProjectState({ id: projectId, project: item, loading: false, error: null });
      if (item && !editingRef.current) {
        setForm({
          name: item.name,
          category: item.category,
          tagline: item.tagline,
          status: item.status,
          carouselRows: item.carouselRows,
        });
      }
    }, (error) => {
      setProjectState({ id: projectId, project: null, loading: false, error });
    });
  }, [projectId]);

  const { project, loading, error: loadError } = projectState;
  const waitingForCurrentProject = loading || projectState.id !== projectId;

  const displayImages = useMemo(() => [
    ...(project?.images || []).map((url, index) => ({ url, persistent: true, persistedIndex: index })),
  ], [project?.images]);

  if (waitingForCurrentProject) {
    return (
      <section>
        <AdminTopbar title="Loading project..." description="Fetching the latest project details from Firestore." />
      </section>
    );
  }

  if (loadError) {
    return (
      <section>
        <AdminTopbar title="Unable to load project" description={loadError.message} />
        <Button variant="outline" render={<Link href="/admin/dashboard" />}>Back to Dashboard</Button>
      </section>
    );
  }

  if (!project) {
    return (
      <section>
        <AdminTopbar title="Project not found" description="This project does not exist in Firestore." />
        <Button variant="outline" render={<Link href="/admin/dashboard" />}>Back to Dashboard</Button>
      </section>
    );
  }

  const visibleImages = showAllImages ? displayImages : displayImages.slice(0, 9);
  const hiddenImageCount = Math.max(displayImages.length - visibleImages.length, 0);

  async function saveDetails(event) {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      await updateProject(project.id, form);
      setEditing(false);
      setSaved(true);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setForm({
      name: project.name,
      category: project.category,
      tagline: project.tagline,
      status: project.status,
      carouselRows: project.carouselRows,
    });
    setEditing(false);
    setSaved(false);
    setSaveError('');
  }

  async function handleImagesAdded(uploadResults) {
    const imageUrls = uploadResults.map((image) => image.url);

    if (!imageUrls.length) return;
    await addProjectImages(project.id, imageUrls);
  }

  function confirmRemoveImage(image) {
    if (!window.confirm('Delete this image from the project?')) return;
    removeProjectImage(project.id, image.persistedIndex);
  }

  async function confirmDeleteProject() {
    if (!window.confirm(`Delete "${project.name}" from the CMS and gallery?`)) return;
    await deleteProject(project.id);
    router.replace('/admin/dashboard');
  }

  return (
    <section>
      <AdminTopbar
        eyebrow="Project detail"
        title={project.name}
        description="Edit project details and manage Firestore image URL references."
        action={<Button variant="outline" render={<Link href="/admin/dashboard" />}><ArrowLeft className="size-4" />Back</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={saveDetails} className="rounded-3xl bg-white/90 p-6 shadow-[0_14px_35px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Details</h2>
              <p className="mt-1 text-sm text-slate-500">Fields saved to the Firestore project document.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#8a5a32]/10 px-3 py-1 text-xs font-medium text-[#8a5a32]">{project.status}</span>
              <Button
                type="button"
                variant="outline"
                onClick={confirmDeleteProject}
                className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800"
                aria-label="Delete project"
              >
                <Trash2 className="size-4" />
              </Button>
              {!editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSaved(false);
                    setSaveError('');
                    setEditing(true);
                  }}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="detail-name">Name</Label>
              <Input id="detail-name" value={form.name} disabled={!editing} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail-category">Category</Label>
              <Input id="detail-category" value={form.category} disabled={!editing} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail-status">Status</Label>
              <Input id="detail-status" list="project-status-options" value={form.status} disabled={!editing} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} />
              <datalist id="project-status-options">
                <option value="Draft" />
                <option value="Published" />
              </datalist>
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-950">Gallery carousel rows</legend>
              <div className="inline-grid overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm sm:grid-cols-2">
                {[
                  { value: 1, label: 'One row' },
                  { value: 2, label: 'Two rows' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${form.carouselRows === option.value ? 'bg-white text-[#8a5a32] shadow-sm' : 'text-slate-500'} ${editing ? 'cursor-pointer hover:text-slate-950' : 'opacity-70'}`}
                  >
                    <input
                      type="radio"
                      name="detail-carousel-rows"
                      value={option.value}
                      checked={form.carouselRows === option.value}
                      disabled={!editing}
                      onChange={() => setForm((current) => ({ ...current, carouselRows: option.value }))}
                      className="accent-[#8a5a32]"
                    />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <Label htmlFor="detail-tagline">Tagline / description</Label>
              <textarea
                id="detail-tagline"
                value={form.tagline}
                disabled={!editing}
                onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))}
                className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:bg-input/50 disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              {editing && (
                <>
                  <Button type="submit" disabled={saving} className="bg-[#8a5a32] text-white hover:bg-[#704626]">{saving ? 'Saving...' : 'Save details'}</Button>
                  <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
                </>
              )}
              {saved && <p className="text-sm text-[#8a5a32]">Saved to Firestore.</p>}
              {saveError && <p className="text-sm text-red-700">{saveError}</p>}
            </div>
          </div>
        </form>

        <div className="space-y-5">
          <ImageDropzone onImagesAdded={handleImagesAdded} />
          <div className="rounded-3xl bg-white/90 p-6 shadow-[0_14px_35px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Images</h2>
                <p className="mt-1 text-sm text-slate-500">{project.images.length} saved image URLs in this project.</p>
                <p className="mt-1 text-xs text-slate-500">New uploads are stored in Cloudinary and appear on the public gallery.</p>
              </div>
            </div>

            {displayImages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/70 p-8 text-center">
                <p className="font-medium text-slate-950">No images yet</p>
                <p className="mt-2 text-sm text-slate-500">Use Add Images above to preview files in this project.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleImages.map((image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedImage({ src: image.url, alt: `${project.name} image ${index + 1}` })}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedImage({ src: image.url, alt: `${project.name} image ${index + 1}` });
                      }
                    }}
                    className="group relative h-44 overflow-hidden rounded-2xl bg-slate-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a5a32]/70"
                  >
                    <Image src={image.url} alt={`${project.name} image ${index + 1}`} fill sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        confirmRemoveImage(image);
                      }}
                      className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-slate-950/75 text-white opacity-0 transition hover:bg-[#8a5a32] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group-hover:opacity-100"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                {hiddenImageCount > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full rounded-2xl sm:col-span-2 lg:col-span-3"
                    onClick={() => setShowAllImages(true)}
                  >
                    View all {displayImages.length} images
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedImage(null)}>
          <button
            type="button"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image preview"
          >
            <X className="size-5" />
          </button>
          <div className="relative h-[82vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-slate-900" onClick={(event) => event.stopPropagation()}>
            <Image src={selectedImage.src} alt={selectedImage.alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
