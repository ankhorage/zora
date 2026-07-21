import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { mock, test } from 'bun:test';

type ModuleMock = Record<string, unknown>;

const SNAPSHOT_PREFIX = 'ZORA_REGISTRY_SNAPSHOT:';
const sourceRoot = path.resolve(import.meta.dir, '../src');

function createMockComponent() {
  return null;
}

function listRuntimeSourceFiles(directoryPath: string): string[] {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      return listRuntimeSourceFiles(entryPath);
    }

    if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) {
      return [];
    }

    return entry.name.includes('.test.') ? [] : [entryPath];
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function listRuntimeNamedBindings(moduleSpecifier: string): readonly string[] {
  const bindingPattern = new RegExp(
    `(?:import|export)\\s+(?!type\\s)\\{([\\s\\S]*?)\\}\\s+from\\s+['"]${escapeRegExp(moduleSpecifier)}['"]`,
    'g',
  );
  const boundNames = new Set<string>();

  for (const filePath of listRuntimeSourceFiles(sourceRoot)) {
    const source = readFileSync(filePath, 'utf8');
    for (const match of source.matchAll(bindingPattern)) {
      for (const rawSpecifier of match[1].split(',')) {
        const specifier = rawSpecifier.trim();
        if (!specifier || specifier.startsWith('type ')) {
          continue;
        }

        const importedName = specifier.split(/\s+as\s+/)[0]?.trim();
        if (importedName) {
          boundNames.add(importedName);
        }
      }
    }
  }

  return [...boundNames].sort();
}

function createRuntimeModuleMock(
  moduleSpecifier: string,
  overrides: Readonly<Record<string, unknown>> = {},
): ModuleMock {
  return Object.fromEntries(
    listRuntimeNamedBindings(moduleSpecifier).map((name) => [
      name,
      Object.hasOwn(overrides, name) ? overrides[name] : createMockComponent,
    ]),
  );
}

mock.module('react-native', () =>
  createRuntimeModuleMock('react-native', {
    Platform: {
      OS: 'web',
      select: <T>(options: Partial<Record<string, T>>): T | undefined =>
        options.web ?? options.default,
    },
    StyleSheet: {
      create: <T>(styles: T): T => styles,
      flatten: <T>(style: T): T => style,
    },
  }),
);

mock.module('@ankhorage/surface', () =>
  createRuntimeModuleMock('@ankhorage/surface', {
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
  }),
);

mock.module('@react-native-picker/picker', () => ({
  Picker: createMockComponent,
}));

mock.module('expo-linear-gradient', () => ({
  LinearGradient: createMockComponent,
}));

test('prints the canonical ZORA component registry snapshot', async () => {
  const { ZORA_COMPONENT_REGISTRY } = await import('../src/registry');

  console.log(`${SNAPSHOT_PREFIX}${JSON.stringify(Object.keys(ZORA_COMPONENT_REGISTRY).sort())}`);
});
