import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

function toPlain(value) {
  if (!value) return value;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(toPlain);
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toPlain(item)]));
  return value;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageSize = Number(searchParams.get('limit') || 4);
  const cursor = searchParams.get('cursor');
  let ref = getAdminDb().collection('galleryFolders').where('published', '==', true).orderBy('order', 'asc').limit(pageSize);
  if (cursor) ref = getAdminDb().collection('galleryFolders').where('published', '==', true).orderBy('order', 'asc').startAfter(Number(cursor)).limit(pageSize);
  const snapshot = await ref.get();
  const folders = snapshot.docs.map((doc) => ({ id: doc.id, ...toPlain(doc.data()) }));
  return NextResponse.json({ folders, cursor: folders.at(-1)?.order ?? null, hasMore: folders.length === pageSize });
}
