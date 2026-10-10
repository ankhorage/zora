import { readFileSync } from 'node:fs';

import { isCapability, isCapabilityId } from '@ankhorage/capability';
import type { Capability } from '@ankhorage/contracts/capability';
import { isRecord } from '@ankhorage/utility/object';
import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../features/registry';
import { CAPABILITIES } from './index';

const packageJson: unknown = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);
const packageCapabilities =
  isRecord(packageJson) && isRecord(packageJson.ankh) ? packageJson.ankh.capabilities : undefined;

test('publishes valid, uniquely identified canonical ZORA capabilities', () => {
  expect(CAPABILITIES.every(isCapability)).toBe(true);
  expect(new Set(CAPABILITIES.map((capability) => capability.id)).size).toBe(CAPABILITIES.length);
});

test('projects each direct-manifest event metadata entry into one canonical event capability', () => {
  const metadataEvents = Object.values(ZORA_COMPONENT_META)
    .filter((component) => component.directManifestNode)
    .flatMap((component) => Object.values(component.events ?? {}));
  const eventCapabilities = CAPABILITIES.filter((capability) => capability.access.includes('emit'));

  expect(eventCapabilities).toHaveLength(
    new Set(metadataEvents.map((event) => event.eventType)).size,
  );
  const eventCapabilitiesById = new Map<Capability['id'], Capability>(
    eventCapabilities.map((capability) => [capability.id, capability]),
  );

  for (const event of metadataEvents) {
    if (!isCapabilityId(event.eventType)) throw new Error(`Invalid event id: ${event.eventType}`);
    const capability = eventCapabilitiesById.get(event.eventType);
    expect(capability?.owner).toBe('@ankhorage/zora');
    expect(capability?.access).toEqual(['emit']);
    expect(capability?.binding).toEqual({ kind: 'event', bindableAs: ['source'] });
    expect(capability?.label).toBe(event.label);
    expect(capability?.description).toBe(event.description);
  }
});

test('projects event payload metadata into matching output schemas', () => {
  const eventCapabilities = new Map<Capability['id'], Capability>(
    CAPABILITIES.filter((capability) => capability.access.includes('emit')).map((capability) => [
      capability.id,
      capability,
    ]),
  );

  for (const component of Object.values(ZORA_COMPONENT_META)) {
    if (!component.directManifestNode) continue;
    for (const event of Object.values(component.events ?? {})) {
      if (!isCapabilityId(event.eventType)) throw new Error(`Invalid event id: ${event.eventType}`);
      const capability = eventCapabilities.get(event.eventType);
      const schema = capability?.output?.schema;
      expect(schema?.type).toBe('object');

      for (const field of event.payloadFields ?? []) {
        if (field.path.includes('.')) continue;
        const fieldSchema = Object.entries(schema?.properties ?? {}).find(
          ([fieldName]) => fieldName === field.path,
        )?.[1];
        expect(fieldSchema?.type).toBe(
          field.type === 'record' ? 'object' : field.type === 'unknown' ? undefined : field.type,
        );
        expect(fieldSchema?.additionalProperties).toBe(field.type === 'record' ? true : undefined);
        expect(fieldSchema?.title).toBe(field.label);
        expect(fieldSchema?.description).toBe(field.description);
      }
    }
  }
});

test('keeps Ankh package metadata identical to the canonical catalog', () => {
  expect(Array.isArray(packageCapabilities)).toBe(true);
  if (!Array.isArray(packageCapabilities)) {
    throw new Error('Expected package capability descriptors.');
  }
  expect(packageCapabilities.every(isCapability)).toBe(true);
  expect(packageCapabilities).toEqual(CAPABILITIES);
});

test('exports the catalog from the public capabilities subpath', async () => {
  const capabilities: unknown = await import('@ankhorage/zora/capabilities');
  if (!isRecord(capabilities)) {
    throw new Error('Expected a capability module record.');
  }

  expect(capabilities.CAPABILITIES).toEqual(CAPABILITIES);
});

test('preserves the executable action semantics of ZORA provider capabilities', () => {
  const actions = CAPABILITIES.filter((capability) => capability.access.includes('invoke'));
  expect(actions.map((capability) => capability.id)).toEqual(['zora.create', 'zora.sync']);
  expect(actions.every((capability) => capability.binding.kind === 'action')).toBe(true);
  expect(actions.every((capability) => capability.binding.bindableAs.includes('target'))).toBe(
    true,
  );
});

test('built public capability entrypoint imports under Node ESM', async () => {
  const subprocess = Bun.spawn(
    [
      'node',
      '--input-type=module',
      '-e',
      "import('./dist/capabilities/index.js').then(({ CAPABILITIES }) => { if (!Array.isArray(CAPABILITIES)) process.exit(1); });",
    ],
    {
      cwd: process.cwd(),
      stderr: 'pipe',
      stdout: 'pipe',
    },
  );
  const [exitCode, stderr] = await Promise.all([
    subprocess.exited,
    new Response(subprocess.stderr).text(),
  ]);

  expect(stderr).toBe('');
  expect(exitCode).toBe(0);
});
