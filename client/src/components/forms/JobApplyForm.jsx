import { LeadForm } from './LeadForm';
export function JobApplyForm({ jobId }) { return <LeadForm type="job-application" source="careers" jobId={jobId} cta="Apply Now" />; }
