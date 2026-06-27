'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImage } from '@/lib/uploads';

const categoryOptions = ['Kitchen', 'Wardrobe', 'Bedroom', 'Living Room'];

function createProjectId(name) {
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${slug || 'project'}-${Date.now()}`;
}

export function AddProjectModal({ open, onClose, onAddProject }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kitchen');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [tagline, setTagline] = useState('');
  const [status, setStatus] = useState('Draft');
  const [carouselRows, setCarouselRows] = useState(2);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const firstFieldRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  async function submit(event) {
    event.preventDefault();
    if (step === 1) {
      continueToImages();
      return;
    }
    if (!name.trim() || !tagline.trim()) return;
    setSubmitting(true);
    setError('');
    let shouldClose = false;
    try {
      const imageUrls = images.map((image) => image.url);
      await onAddProject({
        id: createProjectId(name),
        name: name.trim(),
        category: (customCategory || category).trim() || 'Custom',
        tagline: tagline.trim() || 'New gallery project ready for images.',
        status,
        carouselRows,
        images: imageUrls,
      });
      resetForm();
      shouldClose = true;
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      if (shouldClose) onClose();
    }
  }

  function resetForm() {
    setName('');
    setCategory('Kitchen');
    setShowCustomCategory(false);
    setCustomCategory('');
    setTagline('');
    setStatus('Draft');
    setCarouselRows(2);
    setImages([]);
    setUploading(false);
    setError('');
    setStep(1);
  }

  async function uploadSelectedFiles(fileList) {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const uploadedImages = await Promise.all(files.map(uploadImage));
      setImages((currentImages) => [...currentImages, ...uploadedImages]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function chooseImages(event) {
    uploadSelectedFiles(event.target.files);
  }

  function dropImages(event) {
    event.preventDefault();
    if (uploading) return;
    uploadSelectedFiles(event.dataTransfer.files);
  }

  function continueToImages() {
    if (!name.trim() || !tagline.trim()) {
      setError('Add a project name and tagline before uploading images.');
      return;
    }
    setError('');
    setStep(2);
  }

  function removeImage(imageUrl) {
    setImages((currentImages) => currentImages.filter((image) => image.url !== imageUrl));
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const focusable = modalRef.current?.querySelectorAll('button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="add-project-title">
      <div ref={modalRef} onKeyDown={trapFocus} className="max-h-[calc(100svh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:max-h-[calc(100svh-2rem)] sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a32]">Instant add</p>
          <h2 id="add-project-title" className="mt-1 text-2xl font-semibold text-slate-950">Add Project</h2>
          <p className="mt-2 text-sm text-slate-500">Choose Draft to keep it hidden, or Published to show it on the gallery.</p>
        </div>
        <div className="mb-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-1 text-sm font-medium">
          {['Information', 'Images'].map((label, index) => {
            const stepNumber = index + 1;
            const isActive = step === stepNumber;
            return (
              <button
                key={label}
                type="button"
                onClick={() => (stepNumber === 1 ? setStep(1) : continueToImages())}
                className={`rounded-xl px-3 py-2 transition ${isActive ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
              >
                {stepNumber}. {label}
              </button>
            );
          })}
        </div>
        <form onSubmit={submit} autoComplete="off" className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Name</Label>
                <Input ref={firstFieldRef} id="project-name" name="new-project-name" autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="project-category">Category</Label>
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory((value) => !value)}
                    className="inline-flex items-center gap-1 rounded-full border border-[#8a5a32]/20 px-3 py-1 text-xs font-medium text-[#8a5a32] transition hover:bg-[#8a5a32]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a5a32]/40"
                  >
                    <Plus className="size-3" />
                    Add category
                  </button>
                </div>
                <Input id="project-category" name="new-project-category" autoComplete="off" list="project-categories" value={category} onChange={(event) => setCategory(event.target.value)} />
                <datalist id="project-categories">
                  {categoryOptions.map((option) => <option key={option} value={option} />)}
                </datalist>
              </div>
              {showCustomCategory && (
                <div className="space-y-2">
                  <Label htmlFor="project-custom-category">New category</Label>
                  <Input id="project-custom-category" name="new-project-custom-category" autoComplete="off" value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} placeholder="Enter category name" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="project-tagline">Tagline</Label>
                <Input id="project-tagline" name="new-project-tagline" autoComplete="off" value={tagline} onChange={(event) => setTagline(event.target.value)} placeholder="Short project description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-status">Status</Label>
                <select
                  id="project-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
                <p className="text-xs text-slate-500">Draft projects stay in the CMS only. Published projects appear on the public gallery.</p>
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
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition ${carouselRows === option.value ? 'bg-white text-[#8a5a32] shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      <input
                        type="radio"
                        name="project-carousel-rows"
                        value={option.value}
                        checked={carouselRows === option.value}
                        onChange={() => setCarouselRows(option.value)}
                        className="mt-1 accent-[#8a5a32]"
                      />
                      <span className="font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-lg font-semibold text-slate-950">Images</h3>
              </div>
              <div className="space-y-4 p-5">
                <input ref={fileInputRef} id="project-images" type="file" accept="image/*" multiple onChange={chooseImages} disabled={uploading} className="sr-only" />
                <label
                  htmlFor="project-images"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={dropImages}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center transition hover:border-[#8a5a32]/35 hover:bg-[#fffaf3]"
                >
                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm">
                    <Upload className="size-4" />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </span>
                  <span className="mt-4 text-sm text-slate-600">Choose images or drag & drop it here.</span>
                  <span className="mt-1 text-xs text-slate-500">JPG, JPEG, PNG and WEBP. Max 20 MB.</span>
                </label>
                {images.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{images.length} image{images.length === 1 ? '' : 's'} selected</span>
                      <button type="button" onClick={() => setImages([])} className="font-medium text-[#8a5a32] hover:text-[#704626]">
                        Clear all
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {images.slice(0, 8).map((image, index) => (
                        <div key={image.url} className="group relative h-24 overflow-hidden rounded-xl bg-slate-100">
                          <Image src={image.url} alt={`Selected project preview ${index + 1}`} fill sizes="7rem" className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(image.url)}
                            className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600"
                            aria-label={`Remove selected image ${index + 1}`}
                          >
                            <X className="size-3.5" />
                          </button>
                          {index === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-full bg-[#8a5a32] px-2 py-0.5 text-[10px] text-white">Cover</span>}
                        </div>
                      ))}
                      {images.length > 8 && (
                        <div className="grid h-24 place-items-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-500">
                          +{images.length - 8} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            {step === 1 ? (
              <>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="bg-[#8a5a32] text-white hover:bg-[#704626]">Next</Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" disabled={submitting || uploading} className="bg-[#8a5a32] text-white hover:bg-[#704626]">
                  {submitting ? 'Adding...' : 'Add Project'}
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
