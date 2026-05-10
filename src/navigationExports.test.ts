import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

describe('navigation exports', () => {
  test('exports navigation chrome from src/index.ts', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'index.ts'), 'utf8');

    expect(source).toContain('export { NavigationItem }');
    expect(source).toContain('export { NavigationList }');
    expect(source).toContain('export { ZoraTabBar }');
    expect(source).toContain('export { ZoraDrawerContent }');
  });
});
