import { describe, expect, mock, test } from 'bun:test';

import type { ZoraComponentRegistry } from './index';

const NON_RUNTIME_COMPONENT_EXPORTS = new Set(['SelectionProvider', 'ToastProvider']);

function createMockComponent() {
  return null;
}

const surfaceMockComponentNames = [
  'ActionSheet',
  'ActionSheetItem',
  'AppBar',
  'Badge',
  'Box',
  'Button',
  'ButtonBase',
  'Card',
  'Center',
  'Checkbox',
  'Container',
  'Divider',
  'Drawer',
  'DrawerNavigation',
  'Field',
  'Grid',
  'Icon',
  'IconButton',
  'Image',
  'Inline',
  'Menu',
  'Modal',
  'NavigationItem',
  'NavigationList',
  'Radio',
  'ScrollArea',
  'Show',
  'Spacer',
  'Stack',
  'Surface',
  'Switch',
  'Text',
  'Textarea',
  'ThemeProvider',
  'Toast',
  'ToastProvider',
] as const;

const surfaceComponentMocks = Object.fromEntries(
  surfaceMockComponentNames.map((name) => [name, createMockComponent]),
);

await mock.module('react-native', () => ({
  Image: createMockComponent,
  Platform: {
    OS: 'web',
    select: <T>(options: Partial<Record<string, T>>): T | undefined =>
      options.web ?? options.default,
  },
  Pressable: createMockComponent,
  ScrollView: createMockComponent,
  StyleSheet: {
    create: <T>(styles: T): T => styles,
    flatten: <T>(style: T): T => style,
  },
  Text: createMockComponent,
  View: createMockComponent,
}));

await mock.module('@ankhorage/surface', () => ({
  ...surfaceComponentMocks,
  ThemeContext: {
    Provider: createMockComponent,
  },
  createTheme: () => ({}),
  resolveResponsive: <T>(value: T): T => value,
  useFontContext: () => ({ activeFontId: undefined }),
  useResponsiveRuntime: () => ({ breakpoint: 'base' }),
  useTheme: () => ({
    mode: 'light',
    setMode: () => undefined,
    setThemeConfig: () => undefined,
    theme: {},
  }),
  useToast: () => ({
    dismiss: () => undefined,
    show: () => undefined,
  }),
}));

await mock.module('@react-native-picker/picker', () => ({
  Picker: createMockComponent,
}));

await mock.module('expo-linear-gradient', () => ({
  LinearGradient: createMockComponent,
}));

const { ZORA_COMPONENT_REGISTRY } = await import('./registry');

async function listPublicConcreteComponentExports(): Promise<readonly string[]> {
  const source = await Bun.file('src/index.ts').text();
  return Array.from(
    source.matchAll(
      /export\s+\{([^}]+)\}\s+from '\.\/(components\/[^']+|foundation|layout\/[^']+|patterns\/[^']+)';/g,
    ),
  )
    .flatMap((match) => match[1].split(',').map((item) => item.trim()))
    .map((item) => item.split(' as ')[0].trim())
    .filter((name) => /^[A-Z][A-Za-z0-9]+$/.test(name))
    .filter((name) => !NON_RUNTIME_COMPONENT_EXPORTS.has(name))
    .sort();
}

describe('ZORA_COMPONENT_REGISTRY', () => {
  test('is exported from the public root API', async () => {
    const source = await Bun.file('src/index.ts').text();
    const registry: ZoraComponentRegistry = ZORA_COMPONENT_REGISTRY;

    expect(registry.Screen).toBeDefined();
    expect(registry.Box).toBeDefined();
    expect(source).toContain("export type { ZoraComponentRegistry } from './registry';");
    expect(source).toContain("export { ZORA_COMPONENT_REGISTRY } from './registry';");
  });

  test('covers every public concrete ZORA component export supported for runtime rendering', async () => {
    const publicComponentExports = await listPublicConcreteComponentExports();

    expect(Object.keys(ZORA_COMPONENT_REGISTRY).sort()).toEqual(publicComponentExports);
  });

  test('does not register provider-only exports', () => {
    expect(ZORA_COMPONENT_REGISTRY.ToastProvider).toBeUndefined();
    expect(ZORA_COMPONENT_REGISTRY.SelectionProvider).toBeUndefined();
  });
});
