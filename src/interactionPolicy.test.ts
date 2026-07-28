/**
 * Interaction policy regression guards.
 *
 * These tests verify that internally owned interactions respect the passive
 * policy returned by the canonical Surface type.  They use static source
 * inspection so they run fast and do not require a renderer.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const ROOT = join(import.meta.dir, '..');
const SRC_ROOT = join(ROOT, 'src');

function readSource(relativePath: string): string {
  return readFileSync(join(SRC_ROOT, relativePath), 'utf8');
}

function readComponent(...segments: string[]): string {
  return readSource(join('components', ...segments));
}

function readPattern(...segments: string[]): string {
  return readSource(join('patterns', ...segments));
}

describe('InteractionPolicy declaration', () => {
  test('ZoraBaseProps uses the canonical Surface type', () => {
    const source = readSource('theme/ZoraBaseProps.ts');

    expect(source).toContain("import type { InteractionPolicy } from '@ankhorage/surface';");
    expect(source).toContain('interactionPolicy?: InteractionPolicy;');
  });

  test('no duplicate local InteractionPolicy type declarations in ZORA source', () => {
    const files = [
      readSource('theme/ZoraBaseProps.ts'),
      readComponent('app-bar', 'types.ts'),
      readComponent('breadcrumbs', 'types.ts'),
      readPattern('empty-state', 'types.ts'),
      readPattern('hero', 'types.ts'),
      readPattern('product-card', 'types.ts'),
      readPattern('scanner', 'types.ts'),
      readPattern('zora-tab-bar', 'types.ts'),
      readComponent('select', 'types.ts'),
      readPattern('tree-view', 'types.ts'),
    ];

    for (const source of files) {
      expect(source).not.toMatch(/interface.*InteractionPolicy|type\s+InteractionPolicy/);
    }
  });

  test('registry contract is compile-time only', () => {
    const registrySource = readSource('registry.ts');

    expect(registrySource).not.toMatch(/type\s+InteractionPolicy/);
    expect(registrySource).toContain(
      "import type { InteractionPolicyProps } from '@ankhorage/surface';",
    );
    expect(registrySource).toMatch(/type\s+AcceptsSurfaceInteractionPolicyProps/);
  });
});

describe('Surface wrapper propagation', () => {
  test('foundation Surface forwards interactionPolicy to Surface', () => {
    const source = readSource('foundation/Surface.tsx');

    expect(source).toContain('interactionPolicy: _interactionPolicy,');
    expect(source).toContain('<SurfaceSurface');
  });
});

describe('AppBar', () => {
  test('forwards interactionPolicy to internal IconButtons', () => {
    const source = readComponent('app-bar', 'AppBar.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toMatch(
      /<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{resolvedMode\.onCancel\}/,
    );
    expect(source).toMatch(
      /<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{overflow\.onPress\}/,
    );
  });
});

describe('Breadcrumbs', () => {
  test('forwards interactionPolicy to internal Buttons', () => {
    const source = readComponent('breadcrumbs', 'Breadcrumbs.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{item\.onPress\}/,
    );
  });
});

describe('EmptyState', () => {
  test('forwards interactionPolicy to Card and internal Buttons', () => {
    const source = readPattern('empty-state', 'EmptyState.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toMatch(/<Card[\s\S]*?interactionPolicy=\{interactionPolicy\}/);
    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?variant=\{primaryAction\.variant\}/,
    );
    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?variant=\{secondaryAction\.variant/,
    );
  });
});

describe('Hero', () => {
  test('forwards interactionPolicy to Card', () => {
    const source = readPattern('hero', 'Hero.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toMatch(/<Card[\s\S]*?interactionPolicy=\{interactionPolicy\}/);
  });

  test('passes interactionPolicy through renderAction to internal Buttons', () => {
    const source = readPattern('hero', 'Hero.tsx');

    expect(source).toMatch(
      /function renderAction\([\s\S]*?interactionPolicy: HeroProps\['interactionPolicy'\]/,
    );
    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?variant=\{action\.variant/,
    );
  });
});

describe('ProductCard', () => {
  test('types extend ZoraBaseProps instead of duplicating InteractionPolicy', () => {
    const source = readPattern('product-card', 'types.ts');

    expect(source).not.toMatch(
      /import type \{\s*InteractionPolicy\s*\} from '@ankhorage\/surface';/,
    );
    expect(source).toMatch(/export interface ProductCardProps extends ZoraBaseProps/);
    expect(source).not.toMatch(/interactionPolicy\?: InteractionPolicy;/);
  });

  test('forwards interactionPolicy to internal Buttons', () => {
    const source = readPattern('product-card', 'ProductCard.tsx');

    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{onPrimaryAction/,
    );
    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{onSecondaryAction/,
    );
  });
});

describe('CameraPermissionView', () => {
  test('forwards interactionPolicy to internal Buttons after prop spreads', () => {
    const source = readPattern('scanner', 'CameraPermissionView.tsx');

    expect(source).toMatch(
      /<Button[\s\S]*?\{\s*\.\.\.requestButtonProps\s*\}[\s\S]*?interactionPolicy=\{interactionPolicy\}/,
    );
    expect(source).toMatch(
      /<Button[\s\S]*?\{\s*\.\.\.manualEntryButtonProps\s*\}[\s\S]*?interactionPolicy=\{interactionPolicy\}/,
    );
  });
});

describe('BarcodeScannerView', () => {
  test('passes interactionPolicy to CameraPermissionView in non-granted states', () => {
    const source = readPattern('scanner', 'BarcodeScannerView.tsx');

    expect(source).toMatch(/<CameraPermissionView[\s\S]*?interactionPolicy=\{interactionPolicy\}/);
  });
});

describe('ZoraTabBar', () => {
  test('does not discard interactionPolicy', () => {
    const source = readPattern('zora-tab-bar', 'ZoraTabBar.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
  });

  test('prevents navigation under passive without disabled semantics', () => {
    const source = readPattern('zora-tab-bar', 'ZoraTabBar.tsx');

    expect(source).toMatch(/onPress=\{[\s\S]*?interactionPolicy === 'passive'\s*\?\s*undefined/);
    expect(source).not.toMatch(/disabled:\s*interactionPolicy === 'passive'/);
    expect(source).not.toMatch(/accessibilityState.*disabled.*interactionPolicy === 'passive'/);
  });
});

describe('Select', () => {
  test('keeps Picker enabled controlled only by real disabled prop', () => {
    const source = readComponent('select', 'Select.tsx');

    expect(source).toMatch(/enabled=\{!disabled\}/);
  });

  test('prevents pointer/touch interaction with Picker subtree while passive', () => {
    const source = readComponent('select', 'Select.tsx');

    expect(source).toMatch(/pointerEvents=\{passive \? 'none' : 'auto'\}/);
    expect(source).toMatch(
      /onValueChange=\{\s*\(\s*itemValue\s*\)\s*=>\s*\{\s*if\s*\(\s*!passive\s*\)/,
    );
  });
});
