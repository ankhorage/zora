import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'bun:test';

describe('SidebarLayout viewport contract', () => {
  it('keeps content-flow sizing as the default', async () => {
    const source = await readFile(new URL('./SidebarLayout.tsx', import.meta.url), 'utf8');

    expect(source).toContain("sizing = 'content'");
    expect(source).toContain("const ownsViewport = sizing === 'viewport'");
    expect(source).toContain("align={ownsViewport ? 'stretch' : 'flex-start'}");
  });

  it('preserves bounded flex sizing for child-owned scroll areas', async () => {
    const source = await readFile(new URL('./SidebarLayout.tsx', import.meta.url), 'utf8');

    expect(source).toContain('flex={ownsViewport ? 1 : undefined}');
    expect(source).toContain('minHeight={ownsViewport ? 0 : undefined}');
    expect(source).toContain('minWidth={ownsViewport ? 0 : undefined}');
  });
});
