import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const foundationIndex = readFileSync(join(import.meta.dir, 'index.ts'), 'utf8');
const rootIndex = readFileSync(join(import.meta.dir, '..', 'index.ts'), 'utf8');

describe('foundation exports', () => {
  it('defines a narrow ZORA foundation export layer', () => {
    expect(foundationIndex).toMatch(/export type \{/);
    expect(foundationIndex).toMatch(/CenterProps/);
    expect(foundationIndex).toMatch(/InlineProps/);
    expect(foundationIndex).toMatch(/ShowProps/);
    expect(foundationIndex).toMatch(/SpacerProps/);
    expect(foundationIndex).not.toMatch(/Box|Container|Grid|Stack|Surface/);
    expect(foundationIndex).not.toMatch(/@ankhorage\/surface/);
    expect(foundationIndex).not.toMatch(/Heading/);
    expect(foundationIndex).not.toMatch(/Text/);
    expect(foundationIndex).not.toMatch(/ThemeProvider/);
    expect(foundationIndex).not.toMatch(/ResponsiveProvider/);
    expect(foundationIndex).not.toMatch(/useTheme/);
    expect(foundationIndex).not.toMatch(/useResponsiveRuntime/);
    expect(foundationIndex).not.toMatch(/resolveResponsive/);
  });

  it('re-exports the foundation layer from the ZORA root entrypoint', () => {
    expect(rootIndex).toMatch(/from '\.\/foundation';/);
  });
});
