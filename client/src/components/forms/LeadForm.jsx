'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { leadSchema } from '@/lib/validations/leads';

const inputClasses = 'h-13 rounded-2xl border-[#8a5a32]/15 bg-white px-4 text-base shadow-[0_10px_30px_rgba(31,26,23,0.04)] transition placeholder:text-slate-400 hover:border-[#8a5a32]/25 focus-visible:border-[#8a5a32]/50 focus-visible:ring-[#8a5a32]/15 md:text-sm';
const labelClasses = 'text-xs font-semibold uppercase tracking-[0.14em] text-[#5f4633]';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>;
}

export function LeadForm({ type = 'callback', source = 'website', requirement, jobId, cta = 'Submit', onSuccess, className }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { type, source, requirement, jobId, status: 'new' },
  });

  async function submit(data) {
    const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Unable to submit lead');
    toast.success('Thanks. Our team will contact you shortly.');
    reset({ type, source, requirement, jobId, status: 'new' });
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className={cn('grid gap-4 sm:gap-5', className)}>
      <input type="hidden" {...register('type')} />
      <input type="hidden" {...register('source')} />
      <input type="hidden" {...register('jobId')} />
      <div className="space-y-2">
        <Label htmlFor="lead-full-name" className={labelClasses}>Full name</Label>
        <Input id="lead-full-name" className={inputClasses} aria-invalid={!!errors.fullName} placeholder="Your name" {...register('fullName')} />
        <FieldError message={errors.fullName?.message} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lead-phone" className={labelClasses}>Phone</Label>
          <Input id="lead-phone" className={inputClasses} aria-invalid={!!errors.phone} placeholder="+91 98765 43210" {...register('phone')} />
          <FieldError message={errors.phone?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-email" className={labelClasses}>Email</Label>
          <Input id="lead-email" type="email" className={inputClasses} aria-invalid={!!errors.email} placeholder="you@example.com" {...register('email')} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lead-city" className={labelClasses}>City</Label>
          <Input id="lead-city" className={inputClasses} aria-invalid={!!errors.city} placeholder="Your city" {...register('city')} />
          <FieldError message={errors.city?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-preferred-location" className={labelClasses}>Preferred location</Label>
          <Input id="lead-preferred-location" className={inputClasses} aria-invalid={!!errors.preferredLocation} placeholder="Nearest showroom / area" {...register('preferredLocation')} />
          <FieldError message={errors.preferredLocation?.message} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="lead-requirement" className={labelClasses}>Requirement</Label>
        <Textarea id="lead-requirement" className={cn(inputClasses, 'min-h-32 resize-none py-4 leading-6')} aria-invalid={!!errors.requirement} {...register('requirement')} placeholder="Tell us about your kitchen, wardrobe, furniture, or franchise requirement..." />
        <FieldError message={errors.requirement?.message} />
      </div>
      {type === 'job-application' && (
        <div className="space-y-2">
          <Label htmlFor="lead-resume-url" className={labelClasses}>Resume URL</Label>
          <Input id="lead-resume-url" className={inputClasses} aria-invalid={!!errors.resumeUrl} {...register('resumeUrl')} placeholder="Cloudinary resume URL" />
          <FieldError message={errors.resumeUrl?.message} />
        </div>
      )}
      <Button disabled={isSubmitting} className="mt-1 h-13 rounded-2xl bg-[var(--brand-ink)] text-base font-semibold text-white shadow-[0_18px_45px_rgba(31,26,23,0.18)] transition hover:-translate-y-0.5 hover:bg-[#332821] md:text-sm">
        {isSubmitting ? 'Submitting...' : cta}
      </Button>
    </form>
  );
}
