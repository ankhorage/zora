import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'bun:test';

describe('Screen scroll ownership contract', () => {
  it('keeps scroll=false as a bounded delegated viewport', async () => {
    const source = await readFile(new URL('./Screen.tsx', import.meta.url), 'utf8');

    expect(source).toContain('if (!scroll)');
    expect(source).toContain('flex={1} minHeight={0} minWidth={0}');
    expect(source).toContain('{children}');
    expect(source).not.toContain('{content}');
  });

  it('keeps normal scrolling owned by Screen', async () => {
    const source = await readFile(new URL('./Screen.tsx', import.meta.url), 'utf8');

    expect(source).toContain('<ScrollArea');
    expect(source).toContain('style={{ flex: 1, minHeight: 0, minWidth: 0 }}');
    expect(source).toContain('<Container maxWidth={resolvePageMaxWidth(width)}');
  });
});
