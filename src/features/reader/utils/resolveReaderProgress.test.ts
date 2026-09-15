import { describe, expect, test } from 'bun:test';

import { resolveReaderProgress } from './resolveReaderProgress';

describe('resolveReaderProgress', () => {
  test('is exported from the package root', async () => {
    const source = await Bun.file('src/index.ts').text();

    expect(source).toContain('ReaderSurface, resolveReaderProgress');
  });

  test('clamps an explicit progress value', () => {
    expect(resolveReaderProgress({ progress: -0.2 })).toBe(0);
    expect(resolveReaderProgress({ progress: 0.35 })).toBe(0.35);
    expect(resolveReaderProgress({ progress: 1.2 })).toBe(1);
  });

  test('derives progress from one-based page state', () => {
    expect(resolveReaderProgress({ page: 1, pageCount: 5 })).toBe(0);
    expect(resolveReaderProgress({ page: 3, pageCount: 5 })).toBe(0.5);
    expect(resolveReaderProgress({ page: 5, pageCount: 5 })).toBe(1);
    expect(resolveReaderProgress({ page: 1, pageCount: 1 })).toBe(1);
  });

  test('returns zero for incomplete or invalid page state', () => {
    expect(resolveReaderProgress({})).toBe(0);
    expect(resolveReaderProgress({ page: 1 })).toBe(0);
    expect(resolveReaderProgress({ page: 1, pageCount: 0 })).toBe(0);
    expect(resolveReaderProgress({ progress: Number.NaN })).toBe(0);
  });
});
