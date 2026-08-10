import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

describe('Supabase server configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('does not create an admin client without a server secret', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SECRET_KEY', '');

    const { getSupabaseAdmin } = await import('./admin');

    expect(getSupabaseAdmin()).toBeNull();
  });

  it('accepts a legacy service-role env name for server-only access', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SECRET_KEY', '');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key');

    const { isSupabaseConfigured } = await import('./admin');

    expect(isSupabaseConfigured()).toBe(true);
  });
});
