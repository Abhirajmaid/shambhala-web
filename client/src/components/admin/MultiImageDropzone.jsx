'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Images } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MultiImageDropzone({ onUploaded }) {
  return (
    <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} options={{ multiple: true, sources: ['local', 'url', 'camera'] }} onSuccess={(result) => {
      const info = result.info;
      onUploaded?.({ url: info.secure_url, publicId: info.public_id, order: Date.now() });
    }}>
      {({ open }) => (
        <button type="button" onClick={() => open()} className="flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/40 p-8 text-center hover:bg-muted">
          <Images className="mb-3 size-8" />
          <span className="font-medium">Drop or choose multiple images</span>
          <span className="mt-1 text-sm text-muted-foreground">Uploads are stored in Cloudinary and appended to this folder.</span>
          <Button type="button" variant="outline" className="mt-4">Open upload widget</Button>
        </button>
      )}
    </CldUploadWidget>
  );
}
