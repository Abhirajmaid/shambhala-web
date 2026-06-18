'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function FolderCard({ folder }) {
  const cover = folder.coverImageUrl || folder.images?.[0]?.url;
  return (
    <Link href={'/admin/gallery/' + folder.id}>
      <Card className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
        <div className="h-36 bg-muted">
          {cover ? <img src={cover} alt={folder.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><Folder className="size-12 text-muted-foreground" /></div>}
        </div>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{folder.name}</p>
            <p className="text-sm text-muted-foreground">{folder.images?.length || 0} images</p>
          </div>
          <Badge variant={folder.published ? 'default' : 'secondary'}>{folder.published ? 'Published' : 'Draft'}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
