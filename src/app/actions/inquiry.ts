'use server';

import { z } from 'zod';
import { createInquiry } from '@/lib/data/repository';
import { checkRateLimit, sanitizeString } from '@/lib/security';

const InquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid telephone number'),
  service_interest: z.string().min(1, 'Please select a service of interest'),
  event_date: z.string().optional().nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitInquiryAction(prevState: unknown, formData: FormData) {
  try {
    const rawData = {
      name: sanitizeString(formData.get('name') as string),
      email: sanitizeString(formData.get('email') as string),
      phone: sanitizeString(formData.get('phone') as string),
      service_interest: sanitizeString(formData.get('service_interest') as string),
      event_date: (formData.get('event_date') as string) || null,
      message: sanitizeString(formData.get('message') as string),
    };

    // Rate limiting: 5 submissions per 5 minutes per email/phone
    const rateCheck = checkRateLimit(`inq-${rawData.email}`, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Submission limit reached. Please wait ${rateCheck.retryAfterSeconds} seconds before sending another inquiry.`,
      };
    }

    const validated = InquirySchema.safeParse(rawData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Invalid form data';
      return { success: false, error: firstError };
    }

    await createInquiry({
      name: validated.data.name,
      email: validated.data.email,
      phone: validated.data.phone,
      service_interest: validated.data.service_interest,
      event_date: validated.data.event_date || null,
      message: validated.data.message,
    });

    return {
      success: true,
      message: 'Thank you for reaching out. A senior producer from Moments Production will contact you shortly.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
    return { success: false, error: msg };
  }
}
