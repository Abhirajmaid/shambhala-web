'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const result = await login(email, password);
      const token = await result.user.getIdTokenResult(true);
      if (token.claims.role !== 'admin' && token.claims.admin !== true) throw new Error('This user is not an admin.');
      router.replace('/admin/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[var(--brand-cream)] p-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>Admin Login</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="space-y-4"><div><Label>Email</Label><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div><div><Label>Password</Label><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div><Button className="w-full">Sign in</Button></form></CardContent></Card></main>;
}
