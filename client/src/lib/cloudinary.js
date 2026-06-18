import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function cloudinaryImageUrl(src, options = {}) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transforms = ['f_auto', 'q_auto', options.width ? `w_${options.width}` : '', options.height ? `h_${options.height}` : '', options.crop ? `c_${options.crop}` : ''].filter(Boolean).join(',');
  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${src}`;
}
