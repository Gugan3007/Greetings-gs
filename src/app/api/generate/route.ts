import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { nanoid } from 'nanoid';
import { networkInterfaces } from 'node:os';

import { formSchema } from '@/features/form/schema';
import { greetingContentSchema, type GreetingContent } from '@/lib/ai/schema';
import { buildSystemPrompt } from '@/lib/ai/prompt';
import { createPersonalizedMock } from '@/lib/ai/mock';
import { dedupeGreetingContent } from '@/lib/ai/dedupe';
import { persistGreeting } from '@/lib/greetings/repository';

export const maxDuration = 60; // 60 seconds max duration for AI generation

function getShareUrl(request: Request, slug: string) {
  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSite && !configuredSite.includes('localhost')) {
    return `${configuredSite.replace(/\/$/, '')}/g/${slug}`;
  }

  const requestUrl = new URL(request.url);
  const localAddress = Object.values(networkInterfaces())
    .flat()
    .find((address) => address?.family === 'IPv4' && !address.internal)?.address;
  const hostname = localAddress || requestUrl.hostname;
  const port = requestUrl.port ? `:${requestUrl.port}` : '';
  return `${requestUrl.protocol}//${hostname}${port}/g/${slug}`;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    
    // 1. Validate incoming form data
    const parsed = formSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const formData = parsed.data;
    const slug = nanoid(10); // Generate unique URL slug
    const ownerToken = nanoid(32);

    // TODO: Handle Image Uploads to Supabase Storage here
    // For now, we pass the data URIs through (or ignore them for the AI prompt)

    let aiContent: GreetingContent;

    // Check if we have the Gemini API key. If not, use a Mock response.
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('⚠️ No GOOGLE_GEMINI_API_KEY found. Falling back to mock generation.');
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      aiContent = createPersonalizedMock(formData);
    } else {
      // 2. Generate content using Vercel AI SDK and Google Gemini 1.5 Pro
      const result = await generateObject({
        model: google('models/gemini-1.5-pro-latest'),
        schema: greetingContentSchema,
        system: buildSystemPrompt(formData),
        prompt: 'Generate the greeting content based on the provided instructions.',
        temperature: 0.7,
      });

      aiContent = result.object;
    }

    aiContent = dedupeGreetingContent(aiContent);
    const persistence = await persistGreeting({
      slug,
      formData,
      content: aiContent,
      ownerToken,
    });

    if (persistence === 'memory') {
      console.warn('⚠️ Supabase is not configured. Greeting is available only while this server is running.');
    }

    // 4. Return the slug for redirect
    return NextResponse.json({
      success: true,
      slug,
      ownerToken,
      shareUrl: getShareUrl(req, slug),
    });

  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during generation' },
      { status: 500 }
    );
  }
}
