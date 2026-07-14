import { NextResponse } from 'next/server';

import { findPublishedGreeting } from '@/lib/greetings/repository';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const greeting = await findPublishedGreeting(slug);

  if (greeting) {
    return NextResponse.json({ success: true, slug, mockContent: greeting });
  }

  return NextResponse.json({ error: 'Greeting not found' }, { status: 404 });
}
