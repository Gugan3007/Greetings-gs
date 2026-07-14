import { createClient } from '@supabase/supabase-js';

// These will be undefined if not set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabase client instance.
 * Warning: if env vars are missing, the client will still initialize but will throw
 * errors on actual network requests. We handle this in our API routes by falling
 * back to mock logic if URL/Key is missing.
 */
export const supabase = createClient(
  supabaseUrl || 'https://mock-project.supabase.co',
  supabaseAnonKey || 'mock-key',
  {
    auth: {
      persistSession: false, // We don't need user sessions for this app currently
    },
  }
);
