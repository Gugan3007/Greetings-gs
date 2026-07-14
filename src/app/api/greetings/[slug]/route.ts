import { NextResponse } from 'next/server';

import { greetingContentSchema } from '@/lib/ai/schema';
import { getGreeting } from '@/lib/greetings/store';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const localGreeting = getGreeting(slug);

  if (localGreeting) {
    return NextResponse.json({ success: true, slug, mockContent: localGreeting });
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data, error } = await supabase
      .from('greetings')
      .select('ai_content')
      .eq('slug', slug)
      .single();

    const parsed = greetingContentSchema.safeParse(data?.ai_content);
    if (!error && parsed.success) {
      return NextResponse.json({ success: true, slug, mockContent: parsed.data });
    }
  }

  return NextResponse.json({ error: 'Greeting not found' }, { status: 404 });
}
