'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/uploads';

export function ImageDropzone({ onImagesAdded }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function addFiles(fileList) {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      await onImagesAdded(await Promise.all(files.map(uploadImage)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className={`rounded-[1.75rem] border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur transition ${dragging ? 'border-[#8a5a32] bg-[#8a5a32]/5' : 'border-white bg-white'}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        addFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => addFiles(event.target.files)}
      />
      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#8a5a32]/10 text-[#8a5a32]">
            <Upload className="size-5" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-950">Add Images</p>
            <p className="mt-1 text-sm text-slate-500">Drag images here or browse from your device.</p>
            <p className="mt-1 text-xs text-slate-400">
              {uploading ? 'Uploading images...' : 'JPG, PNG, WebP. Max 10 MB per image.'}
            </p>
            {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
          </div>
        </div>
        <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()} className="h-10 rounded-xl bg-white px-5">
          {uploading ? 'Uploading...' : 'Browse files'}
        </Button>
      </div>
    </div>
  );
}
