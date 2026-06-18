'use client';

import slugify from 'slugify';
import { useState } from 'react';
import { FolderCard } from '@/components/admin/FolderCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { createDocument } from '@/lib/firebase/firestore-helpers';

export default function GalleryAdminPage() {
  const { items } = useFirestoreCollection('galleryFolders');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  async function createFolder(event) {
    event.preventDefault();
    await createDocument('galleryFolders', { name, slug: slugify(name, { lower: true, strict: true }), images: [], order: items.length, published: false });
    setName(''); setOpen(false);
  }
  return <section className="space-y-6"><div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">Gallery Folders</h1><Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button>New Folder</Button>} /><DialogContent><DialogHeader><DialogTitle>Create folder</DialogTitle></DialogHeader><form onSubmit={createFolder} className="space-y-4"><div><Label>Name</Label><Input value={name} onChange={(event) => setName(event.target.value)} /></div><Button>Create</Button></form></DialogContent></Dialog></div><div className="grid gap-5 md:grid-cols-3 xl:grid-cols-4">{items.map((folder) => <FolderCard key={folder.id} folder={folder} />)}</div></section>;
}
