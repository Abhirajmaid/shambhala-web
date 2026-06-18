'use client';
/* eslint-disable @next/next/no-img-element */

import { useParams, useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { MultiImageDropzone } from '@/components/admin/MultiImageDropzone';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { deleteDocument, setDocument } from '@/lib/firebase/firestore-helpers';

export default function GalleryFolderDetailPage() {
  const { folderId } = useParams();
  const router = useRouter();
  const { item: folder, loading } = useFirestoreDoc('galleryFolders', folderId);
  if (loading) return <p>Loading...</p>;
  if (!folder) return <p>Folder not found.</p>;
  const images = [...(folder.images || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const save = (patch) => setDocument('galleryFolders', folder.id, patch);
  const appendImage = (image) => save({ images: [...images, image], coverImageUrl: folder.coverImageUrl || image.url });
  const removeImage = (image) => save({ images: images.filter((item) => item.url !== image.url) });
  async function removeFolder() { if (!window.confirm('Delete this folder?')) return; await deleteDocument('galleryFolders', folder.id); router.push('/admin/gallery'); }
  return <section className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-4"><div className="space-y-2"><Label>Folder name</Label><Input value={folder.name || ''} onChange={(event) => save({ name: event.target.value })} /></div><div className="flex items-center gap-3"><Checkbox checked={Boolean(folder.published)} onCheckedChange={(published) => save({ published })} /><span>Published</span><Button variant="destructive" onClick={removeFolder}><Trash2 /> Delete folder</Button></div></div><MultiImageDropzone onUploaded={appendImage} /><div className="grid gap-4 md:grid-cols-4">{images.map((image, index) => <div key={image.url} className="overflow-hidden rounded-xl border bg-white"><img src={image.url} alt={image.caption || 'Gallery'} className="h-44 w-full object-cover" /><div className="flex flex-wrap gap-2 p-3"><Button size="sm" variant="outline" onClick={() => save({ coverImageUrl: image.url })}>Set cover</Button><Button size="sm" variant="outline" onClick={() => save({ images: images.map((item) => item.url === image.url ? { ...item, order: Math.max(0, index - 1) } : item) })}>Move up</Button><Button size="sm" variant="destructive" onClick={() => removeImage(image)}>Delete</Button></div></div>)}</div></section>;
}
