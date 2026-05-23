import { z } from 'zod';

export const fileUploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().int().positive().max(5_000_000)
});

export const predictionResponseSchema = z.object({
  message: z.string(),
  createdAt: z.string()
});
