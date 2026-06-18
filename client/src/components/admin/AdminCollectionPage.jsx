'use client';

import slugify from 'slugify';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from './DataTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { createDocument, deleteDocument, setDocument } from '@/lib/firebase/firestore-helpers';

function parseValue(field, raw) {
  if (field.type === 'number') return Number(raw || 0);
  if (field.type === 'boolean') return Boolean(raw);
  if (field.type === 'array') return String(raw || '').split('\n').map((item) => item.trim()).filter(Boolean);
  if (field.type === 'json') {
    try { return JSON.parse(raw || '{}'); } catch { return raw; }
  }
  return raw;
}

function formatValue(field, value) {
  if (field.type === 'array') return Array.isArray(value) ? value.join('\n') : '';
  if (field.type === 'json') return typeof value === 'string' ? value : JSON.stringify(value || field.defaultValue || {}, null, 2);
  return value ?? field.defaultValue ?? '';
}

export function AdminCollectionPage({ title, collectionName, fields, singletonId }) {
  const orderField = fields.some((field) => field.name === 'order') ? 'order' : 'createdAt';
  const { items, loading } = useFirestoreCollection(collectionName, orderField);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const records = singletonId ? items.filter((item) => item.id === singletonId) : items;
  const columns = [
    { header: 'Name', accessorFn: (row) => row.title || row.name || row.customerName || row.clientName || row.city || row.siteName || row.fullName || row.id },
    { header: 'Status', accessorFn: (row) => row.published === false ? 'Draft' : 'Published/Active' },
    { header: 'Order', accessorKey: 'order' },
    { header: 'Actions', cell: ({ row }) => <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => startEdit(row.original)}>Edit</Button>{!singletonId && <Button size="sm" variant="destructive" onClick={() => remove(row.original.id)}>Delete</Button>}</div> },
  ];

  function startCreate() {
    const next = Object.fromEntries(fields.map((field) => [field.name, formatValue(field, field.defaultValue)]));
    setEditing(null);
    setForm(next);
    setOpen(true);
  }

  function startEdit(item) {
    setEditing(item);
    setForm(Object.fromEntries(fields.map((field) => [field.name, formatValue(field, item[field.name])]))) ;
    setOpen(true);
  }

  async function save(event) {
    event.preventDefault();
    const payload = Object.fromEntries(fields.map((field) => [field.name, parseValue(field, form[field.name])]));
    if (payload.name && !payload.slug && fields.some((field) => field.name === 'slug')) payload.slug = slugify(payload.name, { lower: true, strict: true });
    if (payload.title && !payload.slug && fields.some((field) => field.name === 'slug')) payload.slug = slugify(payload.title, { lower: true, strict: true });
    const id = singletonId || editing?.id;
    if (id) await setDocument(collectionName, id, payload); else await createDocument(collectionName, payload);
    toast.success(title + ' saved');
    setOpen(false);
  }

  async function remove(id) {
    if (!window.confirm('Delete this record?')) return;
    await deleteDocument(collectionName, id);
    toast.success(title + ' deleted');
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-semibold">{title}</h1><p className="text-muted-foreground">Manage Firestore collection: {collectionName}</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button onClick={startCreate}>{singletonId && records.length ? 'Edit Main' : 'New Record'}</Button>} />
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Create'} {title}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label || field.name}</Label>
                  {field.type === 'textarea' || field.type === 'array' || field.type === 'json' ? <Textarea rows={field.type === 'json' ? 10 : 4} value={form[field.name] ?? ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} /> : field.type === 'boolean' ? <Checkbox checked={Boolean(form[field.name])} onCheckedChange={(checked) => setForm({ ...form, [field.name]: checked })} /> : <Input type={field.type || 'text'} value={form[field.name] ?? ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />}
                  {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
                </div>
              ))}
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? <p>Loading...</p> : <DataTable data={records} columns={columns} />}
    </section>
  );
}
