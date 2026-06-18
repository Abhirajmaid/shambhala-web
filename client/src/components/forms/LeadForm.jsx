'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { leadSchema } from '@/lib/validations/leads';

export function LeadForm({ type = 'callback', source = 'website', requirement, jobId, cta = 'Submit', onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { type, source, requirement, jobId, status: 'new' },
  });

  async function submit(data) {
    const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Unable to submit lead');
    toast.success('Thanks. Our team will contact you shortly.');
    reset({ type, source, requirement, jobId });
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4">
      <input type="hidden" {...register('type')} />
      <input type="hidden" {...register('source')} />
      <input type="hidden" {...register('requirement')} />
      <input type="hidden" {...register('jobId')} />
      <div><Label>Full name</Label><Input {...register('fullName')} />{errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}</div>
      <div className="grid gap-4 md:grid-cols-2"><div><Label>Phone</Label><Input {...register('phone')} /></div><div><Label>Email</Label><Input {...register('email')} /></div></div>
      <div className="grid gap-4 md:grid-cols-2"><div><Label>City</Label><Input {...register('city')} /></div><div><Label>Preferred location</Label><Input {...register('preferredLocation')} /></div></div>
      <div><Label>Requirement</Label><Textarea {...register('requirement')} placeholder="Kitchen, wardrobe, furniture, franchise inquiry..." /></div>
      {type === 'job-application' && <div><Label>Resume URL</Label><Input {...register('resumeUrl')} placeholder="Cloudinary resume URL" /></div>}
      <Button disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : cta}</Button>
    </form>
  );
}
