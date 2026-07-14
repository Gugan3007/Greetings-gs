import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { uploadRequestSchema } from './upload-contract';

type SignedUpload = {
  path: string;
  token: string;
  publicUrl: string;
};

export async function uploadPhoto(file: File): Promise<string> {
  const fileMetadata = { name: file.name, type: file.type, size: file.size };
  const parsed = uploadRequestSchema.safeParse(fileMetadata);
  if (!parsed.success) throw new Error('Choose a JPG, PNG, WebP, or GIF image up to 10 MB.');

  const response = await fetch('/api/uploads/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });
  const signedUpload = await response.json() as SignedUpload & { error?: string };
  if (!response.ok) throw new Error(signedUpload.error || 'Unable to prepare image upload.');

  const browserClient = getSupabaseBrowserClient();
  if (!browserClient) throw new Error('Cloud image uploads are not configured.');

  const { error } = await browserClient.storage
    .from('greeting-media')
    .uploadToSignedUrl(signedUpload.path, signedUpload.token, file, {
      contentType: file.type,
    });

  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return signedUpload.publicUrl;
}
