import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

import { IMAGE_EXTENSION_BY_TYPE, uploadRequestSchema } from '@/lib/media/upload-contract';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const MEDIA_BUCKET = 'greeting-media';

export async function POST(request: Request) {
  const parsed = uploadRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Choose a JPG, PNG, WebP, or GIF image up to 10 MB.' },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Cloud image uploads are not configured.' },
      { status: 503 }
    );
  }

  const extension = IMAGE_EXTENSION_BY_TYPE[parsed.data.type];
  const path = `uploads/${nanoid(20)}.${extension}`;
  const { data, error } = await admin.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.token) {
    return NextResponse.json(
      { error: error?.message || 'Unable to prepare image upload.' },
      { status: 502 }
    );
  }

  const { data: publicData } = admin.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  return NextResponse.json({
    path,
    token: data.token,
    publicUrl: publicData.publicUrl,
  });
}
