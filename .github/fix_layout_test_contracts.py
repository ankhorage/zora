from pathlib import Path


def replace(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    text = file_path.read_text()
    if old not in text:
        raise RuntimeError(f"Expected migration source not found in {path}: {old!r}")
    file_path.write_text(text.replace(old, new))


replace(
    'src/registry.test.ts',
    "    expect(registryEntries).toContain('Box');",
    "    expect(registryEntries).toContain('View');",
)

replace(
    'src/expo57Migration.test.ts',
    "      join(ROOT, 'src', 'layout', 'app-shell', 'AppShell.tsx'),",
    "      join(ROOT, 'src', 'features', 'layout', 'adapters', 'inbound', 'AppShell.tsx'),",
)

replace(
    'src/interactionPolicy.test.ts',
    "    const source = readSource('features/layout/adapters/inbound/ContentRail.tsx');",
    "    const source = readSource('features/content-rail/adapters/inbound/ContentRail.tsx');",
)

replace(
    'src/constants.ts',
    "  layout: ['Box', 'Container', 'ContentRail', 'Divider', 'Grid', 'Stack'],",
    "  'content-rail': ['ContentRail'],\n  layout: ['Divider', 'Grid', 'Screen', 'ScreenSection', 'ScrollView', 'View'],",
)

replace(
    'src/audit.test.ts',
    "describe('Plan 5 audit — product-facing src imports ZORA foundation, not Surface directly', () => {",
    "describe('Plan 5 audit — product-facing src imports ZORA layout primitives, not Surface directly', () => {",
)
replace(
    'src/audit.test.ts',
    "   * Features, layouts, and patterns that compose ZORA primitives should import\n   * foundation primitives from ZORA, not directly from @ankhorage/surface.\n   * The feature-owned layout adapters are the deliberate Surface foundation boundary.",
    "   * Features and patterns that compose ZORA layout primitives should import them from ZORA,\n   * not directly from @ankhorage/surface. The feature-owned layout adapters are the deliberate\n   * Surface foundation boundary.",
)
replace(
    'src/audit.test.ts',
    "  const PRODUCT_FACING_DIRS = [\n    join(SRC_ROOT, 'features'),\n    join(SRC_ROOT, 'layout'),\n    join(SRC_ROOT, 'patterns'),\n  ];",
    "  const PRODUCT_FACING_DIRS = [join(SRC_ROOT, 'features'), join(SRC_ROOT, 'patterns')];",
)
replace(
    'src/audit.test.ts',
    "    /import \\{[^}]*\\b(Box|Stack|Center|Container|Grid|Inline|Spacer|Divider)\\b[^}]*\\} from '@ankhorage\\/surface'/;",
    "    /import \\{[^}]*\\b(View|ScrollView|Grid|Divider)\\b[^}]*\\} from '@ankhorage\\/surface'/;",
)
replace(
    'src/audit.test.ts',
    "            'Use the feature-owned ZORA layout/foundation API instead.',",
    "            'Use the feature-owned ZORA layout API instead.',",
)

replace(
    'src/metadata/componentMeta.test.ts',
    "      'SettingsRow',\n",
    '',
)
replace(
    'src/metadata/componentMeta.test.ts',
    "      'Box',\n      'Stack',\n      'Grid',\n      'Container',",
    "      'View',\n      'ScrollView',\n      'Grid',",
)
replace(
    'src/metadata/componentMeta.test.ts',
    "      'Box',\n      'Stack',\n      'Card',",
    "      'View',\n      'ScrollView',\n      'Card',",
)

replace(
    'src/metadata/radioGroupReachability.test.ts',
    "  ['Box', ZORA_COMPONENT_META.Box],\n  ['Stack', ZORA_COMPONENT_META.Stack],",
    "  ['View', ZORA_COMPONENT_META.View],\n  ['ScrollView', ZORA_COMPONENT_META.ScrollView],",
)

replace(
    'src/features/bottom-sheet/public.test.ts',
    "    expect(packageJson.dependencies['@ankhorage/surface']).toMatch(/^\\^5\\./u);",
    "    expect(packageJson.dependencies['@ankhorage/surface']).toMatch(/^\\^6\\./u);",
)

replace(
    'src/features/icon/utils/meta.test.ts',
    "    ZORA_COMPONENT_META.Box,\n    ZORA_COMPONENT_META.Stack,\n    ZORA_COMPONENT_META.Grid,\n    ZORA_COMPONENT_META.Container,",
    "    ZORA_COMPONENT_META.View,\n    ZORA_COMPONENT_META.ScrollView,\n    ZORA_COMPONENT_META.Grid,",
)

replace(
    'src/features/content-rail/adapters/inbound/ContentRail.test.ts',
    "    const source = await Bun.file('src/features/layout/adapters/inbound/ContentRail.tsx').text();",
    "    const source = await Bun.file(\n      'src/features/content-rail/adapters/inbound/ContentRail.tsx',\n    ).text();",
)

replace(
    'src/platformAcceptance.test.ts',
    "test('passes the isolated Surface 5 and RN Web 0.21 acceptance suite', () => {",
    "test('passes the isolated Surface 6 and RN Web 0.21 acceptance suite', () => {",
)

Path(__file__).unlink()
