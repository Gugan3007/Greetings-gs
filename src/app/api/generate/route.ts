import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { nanoid } from 'nanoid';

import { formSchema } from '@/features/form/schema';
import { greetingContentSchema, type GreetingContent } from '@/lib/ai/schema';
import { buildSystemPrompt } from '@/lib/ai/prompt';
import { createPersonalizedMock } from '@/lib/ai/mock';
import { supabase } from '@/lib/supabase/client';

export const maxDuration = 60; // 60 seconds max duration for AI generation

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

    // 3. Save to Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from('greetings').insert({
        slug,
        form_data: formData,
        ai_content: aiContent,
        status: 'published',
      });

      if (error) {
        console.error('Supabase insert error:', error);
        // We'll still return success so the user can see it, but log the error
      }
    } else {
      console.warn('⚠️ No NEXT_PUBLIC_SUPABASE_URL found. Skipping database insert.');
      // In a real app we'd throw, but for local dev without DB we'll just return the mock slug
    }

    // 4. Return the slug for redirect
    return NextResponse.json({ success: true, slug, ownerToken, mockContent: aiContent });

  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during generation' },
      { status: 500 }
    );
  }
}
