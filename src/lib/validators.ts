import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const appointmentSchema = z.object({
  doctorId: z.string().cuid(),
  startAt: z.string(),
  endAt: z.string(),
  reason: z.string().optional(),
  locationType: z.enum(['VIDEO', 'AUDIO', 'IN_PERSON']).default('VIDEO'),
});

export const ehrSchema = z.object({
  patientId: z.string().cuid(),
  appointmentId: z.string().cuid().optional(),
  symptoms: z.string().min(3),
  diagnosis: z.string().min(3),
  treatmentPlan: z.string().min(3),
  notes: z.string().optional(),
});

export const prescriptionSchema = z.object({
  patientId: z.string().cuid(),
  ehrRecordId: z.string().cuid().optional(),
  medications: z.string().min(3),
  dosage: z.string().min(3),
  instructions: z.string().min(3),
  expiresAt: z.string().optional(),
});

export const availabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  timezone: z.string().default('UTC'),
});

export const triageSchema = z.object({
  symptoms: z.string().min(10),
});
