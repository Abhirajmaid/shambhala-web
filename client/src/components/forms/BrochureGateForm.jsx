'use client';
import { LeadForm } from './LeadForm';
export function BrochureGateForm({ brochureUrl }) { return <LeadForm type="brochure" source="brochure-dialog" cta="Get Brochure" onSuccess={() => { if (brochureUrl) window.open(brochureUrl, '_blank'); }} />; }
