import { z } from 'zod';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const uploadRequestSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(SUPPORTED_IMAGE_TYPES),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES),
});

export type UploadRequest = z.infer<typeof uploadRequestSchema>;

export const IMAGE_EXTENSION_BY_TYPE: Record<UploadRequest['type'], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
