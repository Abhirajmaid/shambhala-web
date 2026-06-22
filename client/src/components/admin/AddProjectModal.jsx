'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kitchen');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [tagline, setTagline] = useState('');
  const [status, setStatus] = useState('Draft');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const firstFieldRef = useRef(null);
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
    setImages([]);
    setUploading(false);
    setError('');
  }

  async function chooseImages(event) {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      setImages(await Promise.all(files.map(uploadImage)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="add-project-title">
      <div ref={modalRef} onKeyDown={trapFocus} className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a32]">Instant add</p>
          <h2 id="add-project-title" className="mt-1 text-2xl font-semibold text-slate-950">Add Project</h2>
          <p className="mt-2 text-sm text-slate-500">Choose Draft to keep it hidden, or Published to show it on the gallery.</p>
        </div>
        <form onSubmit={submit} autoComplete="off" className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="project-images">Add images</Label>
            <Input id="project-images" type="file" accept="image/*" multiple onChange={chooseImages} disabled={uploading} />
            <p className="text-xs text-slate-500">
              {uploading ? 'Uploading images to Cloudinary...' : 'Selected images upload to Cloudinary and are saved with this project. Max 10 MB per image.'}
            </p>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {images.slice(0, 4).map((image, index) => (
                  <div key={image.url} className="relative h-16 overflow-hidden rounded-xl bg-slate-100">
                    <img src={image.url} alt={`Selected project preview ${index + 1}`} className="h-full w-full object-cover" />
                    {index === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-[#8a5a32] px-2 py-0.5 text-[10px] text-white">Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting || uploading} className="bg-[#8a5a32] text-white hover:bg-[#704626]">
              {submitting ? 'Adding...' : 'Add Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
