type BuildShareUrlOptions = {
  requestUrl: string;
  slug: string;
  configuredSite?: string;
  lanAddress?: string;
  environment?: string;
};

export type ShareScope = 'public' | 'local';

export function buildShareUrl({
  requestUrl,
  slug,
  configuredSite,
  lanAddress,
  environment = process.env.NODE_ENV,
}: BuildShareUrlOptions): { url: string; scope: ShareScope } {
  if (configuredSite) {
    const siteUrl = new URL(configuredSite);
    if (environment === 'production' && siteUrl.protocol !== 'https:') {
      throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS in production.');
    }

    return {
      url: `${siteUrl.origin}/g/${encodeURIComponent(slug)}`,
      scope: siteUrl.protocol === 'https:' ? 'public' : 'local',
    };
  }

  if (environment === 'production') {
    throw new Error('NEXT_PUBLIC_SITE_URL is required for public sharing in production.');
  }

  const source = new URL(requestUrl);
  const hostname = lanAddress || source.hostname;
  const port = source.port ? `:${source.port}` : '';
  return {
    url: `${source.protocol}//${hostname}${port}/g/${encodeURIComponent(slug)}`,
    scope: 'local',
  };
}
