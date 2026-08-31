import { describe, expect, test } from 'bun:test';

import type { ReaderErrorEvent, ReaderLocationChangeEvent, ReaderSurfaceProps } from '../../index';

describe('ReaderSurface public contract', () => {
  test('exports the component and serializable adapter events from the package root', () => {
    const props: ReaderSurfaceProps = { format: 'epub' };
    const location: ReaderLocationChangeEvent = {
      format: 'epub',
      locator: 'epubcfi(/6/4!/4/2)',
      page: 2,
      pageCount: 8,
      progression: 1 / 7,
      chapterId: 'chapter-1',
      chapterTitle: 'A beginning',
      trigger: 'swipe',
    };
    const error: ReaderErrorEvent = {
      code: 'protected-document',
      format: 'pdf',
      message: 'This document is protected.',
    };

    expect(props.format).toBe('epub');
    expect(() => JSON.stringify(location)).not.toThrow();
    expect(() => JSON.stringify(error)).not.toThrow();
  });

  test('exports the reader API from the package root', async () => {
    const source = await Bun.file('src/index.ts').text();

    expect(source).toContain("from './patterns/reader';");
    expect(source).toContain('ReaderSurface, resolveReaderProgress');
  });

  test('keeps parsing, fetching, persistence, and platform APIs outside ZORA', async () => {
    const source = await Bun.file('src/patterns/reader/ReaderSurface.tsx').text();

    expect(source).not.toContain('expo-');
    expect(source).not.toContain('pdfjs');
    expect(source).not.toContain('epubjs');
    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('AsyncStorage');
    expect(source).toContain('accessibilityLiveRegion="polite"');
  });
});
