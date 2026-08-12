from pathlib import Path

Path('src/components/contentFallback.test.ts').write_text(r'''import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const textSource = readFileSync(join(import.meta.dir, 'text', 'Text.tsx'), 'utf8');
const headingSource = readFileSync(join(import.meta.dir, 'heading', 'Heading.tsx'), 'utf8');

describe('content fallback ownership', () => {
  it('keeps Text free of translation context coupling', () => {
    expect(textSource).not.toMatch(/useTranslationContext/);
    expect(textSource).toMatch(/if \(children !== undefined\) return children;/);
    expect(textSource).toMatch(/if \(text !== undefined\) return text;/);
    expect(textSource).toMatch(/return i18nKey;/);
  });

  it('keeps Heading free of translation context coupling', () => {
    expect(headingSource).not.toMatch(/useTranslationContext/);
    expect(headingSource).toMatch(/if \(children !== undefined\) return children;/);
    expect(headingSource).toMatch(/if \(text !== undefined\) return text;/);
    expect(headingSource).toMatch(/return i18nKey;/);
  });
});
''', encoding='utf-8')
