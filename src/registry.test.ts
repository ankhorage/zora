import { describe, expect, test } from 'bun:test';

import type { ZoraComponentRegistry } from './index';

const NON_RUNTIME_COMPONENT_EXPORTS = new Set(['SelectionProvider', 'ToastProvider']);
const REGISTRY_SNAPSHOT_PREFIX = 'ZORA_REGISTRY_SNAPSHOT:';

let registryEntriesPromise: Promise<readonly string[]> | undefined;

async function listRuntimeRegistryEntries(): Promise<readonly string[]> {
  registryEntriesPromise ??= (async () => {
    const subprocess = Bun.spawn({
      cmd: [process.execPath, 'test', 'test-fixtures/registrySnapshot.test.ts'],
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(subprocess.stdout).text(),
      new Response(subprocess.stderr).text(),
      subprocess.exited,
    ]);

    if (exitCode !== 0) {
      throw new Error(`Failed to inspect ZORA_COMPONENT_REGISTRY:\n${stdout}\n${stderr}`);
    }

    const output = `${stdout}\n${stderr}`;
    const escapedPrefix = REGISTRY_SNAPSHOT_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const snapshotJson = new RegExp(`${escapedPrefix}(\\[[^\\r\\n]*\\])`).exec(output)?.[1];

    if (!snapshotJson) {
      throw new Error('Registry snapshot subprocess did not emit a registry snapshot.');
    }

    const parsed: unknown = JSON.parse(snapshotJson);
    if (
      !Array.isArray(parsed) ||
      !parsed.every((entry): entry is string => typeof entry === 'string')
    ) {
      throw new Error('Registry snapshot must be a JSON array of component names.');
    }

    return parsed;
  })();

  return registryEntriesPromise;
}

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
    const registry: ZoraComponentRegistry = {};
    const registryEntries = await listRuntimeRegistryEntries();

    expect(registry).toEqual({});
    expect(registryEntries).toContain('Screen');
    expect(registryEntries).toContain('Box');
    expect(source).toContain("export type { ZoraComponentRegistry } from './registry';");
    expect(source).toContain("export { ZORA_COMPONENT_REGISTRY } from './registry';");
  });

  test('covers every public concrete ZORA component export supported for runtime rendering', async () => {
    const publicComponentExports = await listPublicConcreteComponentExports();

    expect(await listRuntimeRegistryEntries()).toEqual(publicComponentExports);
  });

  test('does not register provider-only exports', async () => {
    const registryEntries = await listRuntimeRegistryEntries();

    expect(registryEntries).not.toContain('ToastProvider');
    expect(registryEntries).not.toContain('SelectionProvider');
  });
});
