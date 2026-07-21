import { describe, expect, test } from 'bun:test';

import type { ZoraComponentRegistry } from './index';

const NON_RUNTIME_COMPONENT_EXPORTS = new Set(['SelectionProvider', 'ToastProvider']);

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

async function listRegistryEntries(): Promise<readonly string[]> {
  const source = await Bun.file('src/registry.ts').text();
  const registryObject =
    /export const ZORA_COMPONENT_REGISTRY: ZoraComponentRegistry = \{([\s\S]+)\n\};/.exec(source);

  expect(registryObject).not.toBeNull();

  return Array.from((registryObject?.[1] ?? '').matchAll(/^ {2}([A-Z][A-Za-z0-9]+),$/gm))
    .map((match) => match[1])
    .sort();
}

describe('ZORA_COMPONENT_REGISTRY', () => {
  test('is exported from the public root API', async () => {
    const source = await Bun.file('src/index.ts').text();
    const registry: ZoraComponentRegistry = {};

    expect(registry).toEqual({});
    expect(source).toContain("export type { ZoraComponentRegistry } from './registry';");
    expect(source).toContain("export { ZORA_COMPONENT_REGISTRY } from './registry';");
  });

  test('covers every public concrete ZORA component export supported for runtime rendering', async () => {
    const publicComponentExports = await listPublicConcreteComponentExports();

    expect(await listRegistryEntries()).toEqual(publicComponentExports);
  });

  test('does not register provider-only exports', async () => {
    const registryEntries = await listRegistryEntries();

    expect(registryEntries).not.toContain('ToastProvider');
    expect(registryEntries).not.toContain('SelectionProvider');
  });
});
