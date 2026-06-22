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
      className={`rounded-3xl border border-dashed p-6 shadow-[0_14px_35px_rgba(15,23,42,0.06)] backdrop-blur transition ${dragging ? 'border-[#8a5a32] bg-[#8a5a32]/5' : 'border-slate-300/80 bg-white/90'}`}
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#8a5a32]/10 text-[#8a5a32]">
              <Upload className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-950">Add Images</p>
              <p className="text-sm text-slate-500">Drop multiple files here or browse from your device.</p>
              <p className="mt-1 text-xs text-slate-500">
                {uploading ? 'Uploading images to Cloudinary...' : 'Images upload to Cloudinary and are saved to this project. Max 10 MB per image.'}
              </p>
              {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
            </div>
          </div>
        </div>
        <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? 'Uploading...' : 'Browse files'}
        </Button>
      </div>
    </div>
  );
}
