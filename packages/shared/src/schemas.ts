import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(3)
});

export const companySchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  industry: z.string().min(2),
  planTier: z.string().optional()
});

export const datasetUploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().int().positive().max(10_000_000)
});

export const csvDataSchema = z.object({
  name: z.string().min(1),
  data: z.string().min(1)
});

export const analysisRunSchema = z.object({
  datasetId: z.string().cuid(),
  title: z.string().min(1),
  description: z.string().optional()
});
