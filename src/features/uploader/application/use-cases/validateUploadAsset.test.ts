import { describe, expect, test } from 'bun:test';

import { validateUploadAsset } from './validateUploadAsset';

const IMAGE_ASSET = {
  kind: 'local',
  uri: 'file://photo.png',
  fileName: 'photo.png',
  contentType: 'image/png',
  sizeBytes: 2_000,
} as const;

describe('validateUploadAsset', () => {
  test('accepts wildcard MIME types', () => {
    expect(validateUploadAsset({ accept: 'image/*', asset: IMAGE_ASSET })).toBeUndefined();
  });

  test('rejects a mismatched MIME type', () => {
    expect(validateUploadAsset({ accept: 'application/json', asset: IMAGE_ASSET })).toContain(
      'File type not accepted',
    );
  });

  test('accepts matching file extensions', () => {
    expect(validateUploadAsset({ accept: '.png', asset: IMAGE_ASSET })).toBeUndefined();
  });

  test('does not reject when the asset lacks metadata needed for validation', () => {
    expect(
      validateUploadAsset({
        accept: 'image/*',
        asset: { kind: 'local', uri: 'file://unknown' },
      }),
    ).toBeUndefined();
  });

  test('rejects assets above the configured size', () => {
    expect(validateUploadAsset({ asset: IMAGE_ASSET, maxSizeBytes: 1_000 })).toContain(
      'File is too large',
    );
  });

  test('runs caller validation after built-in validation', () => {
    expect(
      validateUploadAsset({
        asset: IMAGE_ASSET,
        validate: () => 'Consumer validation failed.',
      }),
    ).toBe('Consumer validation failed.');
  });
});
