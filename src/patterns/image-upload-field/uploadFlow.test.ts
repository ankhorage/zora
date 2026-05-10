import { describe, expect, test } from 'bun:test';

import type { ZoraPickedImage } from './types';
import {
  createOptimisticAssetFromPicked,
  formatAcceptHint,
  formatMaxSizeHint,
  isAccepted,
  resolveRenderableUrl,
  validatePickedImage,
} from './uploadFlow';

describe('uploadFlow', () => {
  test('formatAcceptHint returns null for empty input', () => {
    expect(formatAcceptHint(undefined)).toBeNull();
    expect(formatAcceptHint('')).toBeNull();
    expect(formatAcceptHint('   ')).toBeNull();
  });

  test('formatMaxSizeHint returns null for invalid sizes', () => {
    expect(formatMaxSizeHint(undefined)).toBeNull();
    expect(formatMaxSizeHint(0)).toBeNull();
    expect(formatMaxSizeHint(-5)).toBeNull();
  });

  test('isAccepted supports wildcard image/* matching', () => {
    expect(isAccepted({ accept: 'image/*', contentType: 'image/png', fileName: undefined })).toBe(
      true,
    );
    expect(
      isAccepted({ accept: 'image/*', contentType: 'application/json', fileName: undefined }),
    ).toBe(false);
  });

  test('isAccepted supports exact MIME matching', () => {
    expect(isAccepted({ accept: 'image/png', contentType: 'image/png', fileName: undefined })).toBe(
      true,
    );
    expect(
      isAccepted({ accept: 'image/png', contentType: 'image/jpeg', fileName: undefined }),
    ).toBe(false);
  });

  test('isAccepted supports extension matching', () => {
    expect(isAccepted({ accept: '.png', contentType: undefined, fileName: 'photo.png' })).toBe(
      true,
    );
    expect(isAccepted({ accept: '.png', contentType: undefined, fileName: 'photo.jpg' })).toBe(
      false,
    );
  });

  test('isAccepted does not block when it cannot validate', () => {
    expect(isAccepted({ accept: 'image/*', contentType: undefined, fileName: undefined })).toBe(
      true,
    );
  });

  test('validatePickedImage rejects by accept when metadata allows checking', () => {
    const picked: ZoraPickedImage = { uri: 'file://a', contentType: 'application/json' };
    expect(
      validatePickedImage({
        picked,
        accept: 'image/*',
        maxSizeBytes: undefined,
        validatePicked: undefined,
      }),
    ).toContain('File type not accepted');
  });

  test('validatePickedImage rejects oversize files when sizeBytes is present', () => {
    const picked: ZoraPickedImage = { uri: 'file://a', sizeBytes: 2_000, contentType: 'image/png' };
    const error = validatePickedImage({
      picked,
      accept: 'image/*',
      maxSizeBytes: 1_000,
      validatePicked: undefined,
    });
    expect(error).toContain('File is too large');
  });

  test('validatePickedImage allows oversize when sizeBytes is missing', () => {
    const picked: ZoraPickedImage = { uri: 'file://a', contentType: 'image/png' };
    expect(
      validatePickedImage({
        picked,
        accept: 'image/*',
        maxSizeBytes: 1_000,
        validatePicked: undefined,
      }),
    ).toBeUndefined();
  });

  test('createOptimisticAssetFromPicked maps uri and metadata correctly', () => {
    const picked: ZoraPickedImage = {
      uri: 'file://picked',
      fileName: 'picked.png',
      sizeBytes: 123,
      contentType: 'image/png',
    };
    const asset = createOptimisticAssetFromPicked(picked);
    expect(asset.kind).toBe('url');
    expect(asset.url).toBe('file://picked');
    expect(asset.contentType).toBe('image/png');
    expect(asset.metadata?.fileName).toBe('picked.png');
    expect(asset.metadata?.sizeBytes).toBe(123);
  });

  test('resolveRenderableUrl renders url assets directly and storage only with publicUrl', () => {
    expect(resolveRenderableUrl(null)).toBeNull();
    expect(resolveRenderableUrl({ kind: 'url', url: 'https://x' })).toBe('https://x');
    expect(resolveRenderableUrl({ kind: 'storage', bucket: 'b', path: 'p' })).toBeNull();
    expect(
      resolveRenderableUrl({ kind: 'storage', bucket: 'b', path: 'p', publicUrl: 'https://y' }),
    ).toBe('https://y');
  });
});
