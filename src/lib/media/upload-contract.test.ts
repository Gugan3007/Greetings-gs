import { describe, expect, it } from 'vitest';

import { uploadRequestSchema } from './upload-contract';

describe('media upload contract', () => {
  it('accepts supported images at the size limit', () => {
    expect(uploadRequestSchema.safeParse({
      name: 'photo.jpg',
      type: 'image/jpeg',
      size: 10_485_760,
    }).success).toBe(true);
  });

  it('rejects unsupported image formats', () => {
    expect(uploadRequestSchema.safeParse({
      name: 'payload.svg',
      type: 'image/svg+xml',
      size: 100,
    }).success).toBe(false);
  });

  it('rejects images larger than 10 MiB', () => {
    expect(uploadRequestSchema.safeParse({
      name: 'huge.jpg',
      type: 'image/jpeg',
      size: 10_485_761,
    }).success).toBe(false);
  });
});
