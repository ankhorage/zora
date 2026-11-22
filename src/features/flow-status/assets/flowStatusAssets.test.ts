import { expect, test } from 'bun:test';

const ASSET_DIRECTORY = new URL('./', import.meta.url);

interface FlowStatusAsset {
  readonly id: string;
  readonly source: string;
  readonly colorRole: string;
}

interface FlowStatusAssetManifest {
  readonly scope: string;
  readonly assets: readonly FlowStatusAsset[];
  readonly proposals: { readonly included: boolean };
  readonly notes: readonly string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFlowStatusAsset(value: unknown): value is FlowStatusAsset {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.source === 'string' &&
    typeof value.colorRole === 'string'
  );
}

function isFlowStatusAssetManifest(value: unknown): value is FlowStatusAssetManifest {
  return (
    isRecord(value) &&
    typeof value.scope === 'string' &&
    Array.isArray(value.assets) &&
    value.assets.every(isFlowStatusAsset) &&
    isRecord(value.proposals) &&
    typeof value.proposals.included === 'boolean' &&
    Array.isArray(value.notes) &&
    value.notes.every((note) => typeof note === 'string')
  );
}

test('ships only reference-grounded Flow node status assets', async () => {
  const manifest: unknown = await Bun.file(new URL('manifest.json', ASSET_DIRECTORY)).json();

  expect(isFlowStatusAssetManifest(manifest)).toBe(true);
  if (!isFlowStatusAssetManifest(manifest))
    throw new Error('Expected a valid Flow status asset manifest.');

  expect(manifest.scope).toBe('presentation-only');
  expect(manifest.assets.map(({ id, source, colorRole }) => ({ id, source, colorRole }))).toEqual([
    { id: 'completed', source: 'reference-canvas', colorRole: 'success' },
    { id: 'waiting', source: 'reference-canvas', colorRole: 'attention' },
  ]);
  expect(manifest.proposals.included).toBe(false);
  expect(manifest.notes).toContain(
    'The process-wide Draft chip in the reference is not a node execution status.',
  );
});

test('keeps each status icon standalone, accessible, and badge-ready', async () => {
  const assets = ['completed.svg', 'waiting.svg'];

  await Promise.all(
    assets.map(async (asset) => {
      const svg = await Bun.file(new URL(asset, ASSET_DIRECTORY)).text();

      expect(svg).toContain('<svg');
      expect(svg).toContain('width="24"');
      expect(svg).toContain('height="24"');
      expect(svg).toContain('viewBox="0 0 24 24"');
      expect(svg).toContain('role="img"');
      expect(svg).toContain('<title');
      expect(svg).toContain('<desc');
    }),
  );
});
