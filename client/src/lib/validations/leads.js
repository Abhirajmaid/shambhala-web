import { z } from 'zod';

export const leadSchema = z.object({
  type: z.enum(['callback', 'franchise', 'brochure', 'job-application', 'contact']),
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(8, 'Phone number is required'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  city: z.string().optional(),
  requirement: z.string().optional(),
  currentOccupation: z.string().optional(),
  preferredLocation: z.string().optional(),
  jobId: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  source: z.string().min(1),
});
