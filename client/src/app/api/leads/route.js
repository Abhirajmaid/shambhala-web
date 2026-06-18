import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { leadSchema } from '@/lib/validations/leads';

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.parse(body);
    const ref = await getAdminDb().collection('leads').add({
      ...parsed,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to create lead' }, { status: 400 });
  }
}
