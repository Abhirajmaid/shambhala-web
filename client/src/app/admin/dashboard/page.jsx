'use client';

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase/client';

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  useEffect(() => onSnapshot(query(collection(db, 'leads'), orderBy('createdAt', 'desc')), (snapshot) => setLeads(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))), []);
  const counts = useMemo(() => leads.reduce((acc, lead) => ({ ...acc, [lead.type]: (acc[lead.type] || 0) + 1 }), {}), [leads]);
  return <section className="space-y-6"><h1 className="text-3xl font-semibold">Dashboard</h1><div className="grid gap-4 md:grid-cols-4">{['callback','franchise','brochure','job-application'].map((type) => <Card key={type}><CardHeader><CardTitle className="capitalize">{type}</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{counts[type] || 0}</p></CardContent></Card>)}</div><Card><CardHeader><CardTitle>Recent inquiries</CardTitle></CardHeader><CardContent className="space-y-3">{leads.slice(0,8).map((lead) => <div key={lead.id} className="flex justify-between rounded-lg border p-3"><span>{lead.fullName}</span><span className="text-muted-foreground">{lead.type}</span></div>)}</CardContent></Card></section>;
}
