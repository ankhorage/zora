import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const textSource = readFileSync(join(import.meta.dir, 'text', 'Text.tsx'), 'utf8');
const headingSource = readFileSync(join(import.meta.dir, 'heading', 'Heading.tsx'), 'utf8');

describe('content fallback ownership', () => {
  it('keeps Text free of translation context coupling', () => {
    expect(textSource).not.toMatch(/useTranslationContext/);
    expect(textSource).toMatch(/if \(children !== undefined\) \{/);
    expect(textSource).toMatch(/if \(text !== undefined\) \{/);
    expect(textSource).toMatch(/return i18nKey;/);
  });

  it('keeps Heading free of translation context coupling', () => {
    expect(headingSource).not.toMatch(/useTranslationContext/);
    expect(headingSource).toMatch(/if \(children !== undefined\) \{/);
    expect(headingSource).toMatch(/if \(text !== undefined\) \{/);
    expect(headingSource).toMatch(/return i18nKey;/);
  });
});
