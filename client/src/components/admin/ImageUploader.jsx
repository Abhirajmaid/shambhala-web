'use client';
/* eslint-disable @next/next/no-img-element */

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImageUploader({ value, onChange, label = 'Upload image' }) {
  return (
    <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(result) => {
      const info = result.info;
      onChange?.({ url: info.secure_url, publicId: info.public_id });
    }}>
      {({ open }) => (
        <div className="space-y-2">
          {value && <img src={typeof value === 'string' ? value : value.url} alt="Uploaded preview" className="h-36 w-full rounded-lg object-cover" />}
          <Button type="button" variant="outline" onClick={() => open()}><ImagePlus /> {label}</Button>
        </div>
      )}
    </CldUploadWidget>
  );
}
