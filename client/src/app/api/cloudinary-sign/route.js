import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder: body.folder || 'shambhala' }, process.env.CLOUDINARY_API_SECRET);
  return NextResponse.json({ timestamp, signature, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME });
}
