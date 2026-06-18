'use client';

import { doc, updateDoc } from 'firebase/firestore';
import { useMemo } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { db } from '@/lib/firebase/client';

function exportCsv(leads) {
  const header = ['type','status','fullName','phone','email','city','source'];
  const rows = leads.map((lead) => header.map((key) => JSON.stringify(lead[key] || '')).join(','));
  const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'shambhala-leads.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function LeadsPage() {
  const { items } = useFirestoreCollection('leads', 'createdAt');
  const columns = useMemo(() => [
    { header: 'Name', accessorKey: 'fullName' }, { header: 'Phone', accessorKey: 'phone' }, { header: 'Type', accessorKey: 'type' },
    { header: 'Status', cell: ({ row }) => <Select defaultValue={row.original.status || 'new'} onValueChange={(status) => updateDoc(doc(db, 'leads', row.original.id), { status })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['new','contacted','converted','closed'].map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select> },
    { header: 'Contact', cell: ({ row }) => <div className="flex gap-2"><Button size="sm" variant="outline" render={<a href={'tel:' + row.original.phone} />}>Call</Button>{row.original.email && <Button size="sm" variant="outline" render={<a href={'mailto:' + row.original.email} />}>Email</Button>}</div> },
  ], []);
  return <section className="space-y-6"><div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">Leads</h1><Button onClick={() => exportCsv(items)}>Export CSV</Button></div><DataTable data={items} columns={columns} /></section>;
}
