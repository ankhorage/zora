import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const foundationIndex = readFileSync(join(import.meta.dir, 'index.ts'), 'utf8');
const rootIndex = readFileSync(join(import.meta.dir, '..', 'index.ts'), 'utf8');

describe('foundation exports', () => {
  it('defines a narrow ZORA foundation export layer', () => {
    expect(foundationIndex).toMatch(/export type \{/);
    expect(foundationIndex).toMatch(/BoxProps/);
    expect(foundationIndex).toMatch(/ContainerProps/);
    expect(foundationIndex).toMatch(/GridProps/);
    expect(foundationIndex).toMatch(/StackProps/);
    expect(foundationIndex).toMatch(/SurfaceProps/);
    expect(foundationIndex).toMatch(/Box/);
    expect(foundationIndex).toMatch(/Container/);
    expect(foundationIndex).toMatch(/Grid/);
    expect(foundationIndex).toMatch(/Stack/);
    expect(foundationIndex).toMatch(/Surface/);
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
