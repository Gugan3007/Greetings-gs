import { describe, expect, it } from 'vitest';

import { buildShareUrl } from './share-url';

describe('buildShareUrl', () => {
  it('uses the configured HTTPS origin for a public greeting', () => {
    expect(buildShareUrl({
      requestUrl: 'http://localhost:3000/api/generate',
      slug: 'abc',
      configuredSite: 'https://greetings.example/',
      environment: 'production',
    })).toEqual({ url: 'https://greetings.example/g/abc', scope: 'public' });
  });

  it('returns an explicitly local LAN link in development', () => {
    expect(buildShareUrl({
      requestUrl: 'http://localhost:3000/api/generate',
      slug: 'abc',
      lanAddress: '192.168.1.10',
      environment: 'development',
    })).toEqual({ url: 'http://192.168.1.10:3000/g/abc', scope: 'local' });
  });

  it('rejects production sharing without a configured HTTPS site', () => {
    expect(() => buildShareUrl({
      requestUrl: 'http://localhost:3000/api/generate',
      slug: 'abc',
      environment: 'production',
    })).toThrow('NEXT_PUBLIC_SITE_URL');
  });
});
