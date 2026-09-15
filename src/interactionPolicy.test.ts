/**
 * Interaction policy regression guards.
 *
 * These tests verify that internally owned interactions respect the passive
 * policy returned by the canonical Surface type. They use static source
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

function readFeature(...segments: string[]): string {
  return readSource(join('features', ...segments));
}

describe('InteractionPolicy declaration', () => {
  test('ZoraBaseProps uses the canonical Surface type', () => {
    const source = readSource('types/base.ts');

    expect(source).toContain("import type { InteractionPolicy } from '@ankhorage/surface';");
    expect(source).toContain('interactionPolicy?: InteractionPolicy;');
  });

  test('no duplicate local InteractionPolicy type declarations in ZORA source', () => {
    const files = [
      readSource('types/base.ts'),
      readSource('types/app-bar.ts'),
      readSource('types/breadcrumbs.ts'),
      readSource('types/empty-state.ts'),
      readSource('types/hero.ts'),
      readSource('types/product-card.ts'),
      readSource('types/reader.ts'),
      readSource('types/scanner.ts'),
      readSource('types/select.ts'),
      readSource('types/tree-view.ts'),
    ];

    for (const source of files) {
      expect(source).not.toMatch(/interface.*InteractionPolicy|type\s+InteractionPolicy/);
    }
  });

  test('registry contract is compile-time only', () => {
    const registrySource = readFeature('registry', 'ZORA_COMPONENT_REGISTRY.ts');

    expect(registrySource).not.toMatch(/type\s+InteractionPolicy/);
    expect(registrySource).toContain(
      "import type { InteractionPolicyProps } from '@ankhorage/surface';",
    );
    expect(registrySource).toMatch(/type\s+AcceptsSurfaceInteractionPolicyProps/);
  });
});

describe('Surface wrapper propagation', () => {
  test('foundation Surface forwards interactionPolicy to Surface', () => {
    const source = readSource('features/surface/adapters/inbound/Surface.tsx');

    expect(source).toContain('interactionPolicy: _interactionPolicy,');
    expect(source).toContain('<SurfaceSurface');
  });
});

describe('AppBar', () => {
  test('forwards interactionPolicy to selection and overflow controls', () => {
    const source = readFeature('app-bar', 'adapters', 'inbound', 'AppBar.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toMatch(
      /<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{mode\.onCancel\}/,
    );
    expect(source).toMatch(/<PopoverMenu[\s\S]*?interactionPolicy=\{interactionPolicy\}/);
    expect(source).toMatch(
      /trigger=\{\(\{ toggle \}\) => \([\s\S]*?<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{toggle\}/,
    );
  });
});

describe('Breadcrumbs', () => {
  test('forwards interactionPolicy and emits item ids from internal Buttons', () => {
    const source = readFeature('breadcrumbs', 'adapters', 'inbound', 'Breadcrumbs.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{\(\) => onItemPress\(\{ id: item\.id \}\)\}/,
    );
  });
});

describe('EmptyState', () => {
  test('forwards interactionPolicy to Card and internal Buttons', () => {
    const source = readSource('features/empty-state/adapters/inbound/EmptyState.tsx');

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
    const source = readSource('features/hero/adapters/inbound/Hero.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toMatch(/<Card[\s\S]*?interactionPolicy=\{interactionPolicy\}/);
  });

  test('passes interactionPolicy through renderAction to internal Buttons', () => {
    const source = readSource('features/hero/adapters/inbound/Hero.tsx');

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
    const source = readSource('types/product-card.ts');

    expect(source).not.toMatch(
      /import type \{\s*InteractionPolicy\s*\} from '@ankhorage\/surface';/,
    );
    expect(source).toMatch(/export interface ProductCardProps extends ZoraBaseProps/);
    expect(source).not.toMatch(/interactionPolicy\?: InteractionPolicy;/);
  });

  test('forwards interactionPolicy to internal Buttons', () => {
    const source = readSource('features/card/adapters/inbound/ProductCard.tsx');

    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{onPrimaryAction/,
    );
    expect(source).toMatch(
      /<Button[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{onSecondaryAction/,
    );
  });
});

describe('ReaderSurface', () => {
  test('types extend ZoraBaseProps instead of duplicating InteractionPolicy', () => {
    const source = readSource('types/reader.ts');

    expect(source).not.toMatch(
      /import type \{\s*InteractionPolicy\s*\} from '@ankhorage\/surface';/,
    );
    expect(source).toMatch(/export interface ReaderSurfaceProps extends ZoraBaseProps/);
    expect(source).not.toMatch(/interactionPolicy\?: InteractionPolicy;/);
  });

  test('forwards interactionPolicy to its owned interactive controls', () => {
    const source = readFeature('reader', 'adapters', 'inbound', 'ReaderSurface.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toMatch(
      /function ReaderHeader[\s\S]*?<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}/,
    );
    expect(source).toMatch(
      /function ReaderHeader[\s\S]*?<AppBar[\s\S]*?interactionPolicy=\{interactionPolicy\}/,
    );
    expect(source).toMatch(
      /function ReaderFooter[\s\S]*?<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}/,
    );
    expect(source).toMatch(/<ReaderHeader[\s\S]*?interactionPolicy=\{interactionPolicy\}/);
    expect(source).toMatch(/<ReaderFooter[\s\S]*?interactionPolicy=\{interactionPolicy\}/);
  });
});

describe('ContentRail', () => {
  test('types extend ZoraBaseProps instead of duplicating InteractionPolicy', () => {
    const source = readSource('types/content-rail.ts');

    expect(source).toMatch(/export interface ContentRailProps extends ZoraBaseProps/);
    expect(source).not.toMatch(/interactionPolicy\?: InteractionPolicy;/);
  });

  test('suppresses scrolling and forwards interactionPolicy to owned controls', () => {
    const source = readSource('features/content-rail/adapters/inbound/ContentRail.tsx');

    expect(source).not.toMatch(/interactionPolicy:\s*_interactionPolicy/);
    expect(source).toContain('scrollEnabled={!passive}');
    expect(source).toMatch(
      /<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?label=\{previousLabel\}/,
    );
    expect(source).toMatch(
      /<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?label=\{nextLabel\}/,
    );
  });
});

describe('CameraPermissionView', () => {
  test('forwards interactionPolicy to internal Buttons after prop spreads', () => {
    const source = readFeature('scanner', 'adapters', 'inbound', 'CameraPermissionView.tsx');

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
    const source = readFeature('scanner', 'adapters', 'inbound', 'BarcodeScannerView.tsx');

    expect(source).toMatch(/<CameraPermissionView[\s\S]*?interactionPolicy=\{interactionPolicy\}/);
  });
});

describe('Select', () => {
  test('web forwards interactionPolicy to Popover and option controls', () => {
    const webSource = readFeature('form', 'select', 'adapters', 'inbound', 'Select.web.tsx');
    const optionSource = readFeature('form', 'select', 'composition', 'SelectOptionRow.tsx');

    expect(webSource).toContain('interactionPolicy={props.interactionPolicy}');
    expect(optionSource).toContain('interactionPolicy={interactionPolicy}');
  });

  test('native suppresses opening while passive', () => {
    const nativeSource = readFeature('form', 'select', 'adapters', 'inbound', 'Select.native.tsx');

    expect(nativeSource).toContain("props.interactionPolicy === 'passive'");
    expect(nativeSource).toContain("contentMode: 'direct'");
    expect(nativeSource).toContain('<BottomSheetFlatList');
  });
});

describe('TreeItem', () => {
  test('accepts and forwards interactionPolicy to owned and recursive controls', () => {
    const source = readFeature('tree-view', 'adapters', 'inbound', 'TreeItem.tsx');

    expect(source).toMatch(/interface TreeItemProps[\s\S]*?extends ZoraBaseProps/);
    expect(source).toMatch(/function TreeItemInner[\s\S]*?interactionPolicy,/);
    expect(source).toMatch(
      /<IconButton[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?onPress=\{\(\) => onToggleExpand\(node\.id\)\}/,
    );
    expect(source).toMatch(
      /node\.children\?\.map[\s\S]*?<TreeItem[\s\S]*?interactionPolicy=\{interactionPolicy\}[\s\S]*?node=\{child\}/,
    );
  });
});
