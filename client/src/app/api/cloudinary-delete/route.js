import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  const { publicId } = await request.json();
  if (!publicId) return NextResponse.json({ error: 'publicId is required' }, { status: 400 });
  const result = await cloudinary.uploader.destroy(publicId);
  return NextResponse.json(result);
}
