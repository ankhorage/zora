import { readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from 'bun:test';

const SNAPSHOT_PREFIX = 'ZORA_REGISTRY_SNAPSHOT:';
const sourceRoot = path.resolve(import.meta.dir, '../src');

/*** Reads the canonical runtime registry keys without importing runtime UI modules. */
function readRegistryKeys(): readonly string[] {
  const source = readFileSync(
    path.join(sourceRoot, 'features/registry/ZORA_COMPONENT_REGISTRY.ts'),
    'utf8',
  );
  const registryBody = source.match(
    /const _ZORA_COMPONENT_REGISTRY = \{([\s\S]*?)\n\} as const satisfies ZoraComponentRegistry;/u,
  )?.[1];

  if (!registryBody) {
    throw new Error(
      'Could not locate _ZORA_COMPONENT_REGISTRY in src/features/registry/ZORA_COMPONENT_REGISTRY.ts.',
    );
  }

  return Array.from(registryBody.matchAll(/^\s{2}([A-Z][A-Za-z0-9]+),$/gmu), (match) => match[1])
    .filter((name): name is string => name !== undefined)
    .sort();
}

test('prints the canonical ZORA component registry snapshot', async () => {
  const registryKeys = readRegistryKeys();
  const corePluginSource = readFileSync(
    path.join(sourceRoot, 'features/plugin/ZORA_CORE_PLUGIN.ts'),
    'utf8',
  );
  const { ZORA_COMPONENT_META } = await import('../src/features/authoring');

  expect(registryKeys.length).toBeGreaterThan(0);
  expect(new Set(registryKeys).size).toBe(registryKeys.length);
  expect(corePluginSource).toContain('componentRegistry: ZORA_COMPONENT_REGISTRY');
  expect(ZORA_COMPONENT_META.Screen.allowedChildren).not.toContain('TabletopTable');

  console.log(`${SNAPSHOT_PREFIX}${JSON.stringify(registryKeys)}`);
});
