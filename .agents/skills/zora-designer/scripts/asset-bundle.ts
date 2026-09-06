#!/usr/bin/env bun

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { assertAssetPath, assertImageContent, readAssetFile } from './asset-files.ts';

interface AssetEntry {
  mediaId: string;
  role: 'icon' | 'image';
  sourcePath: string;
  targetPath: string;
  contentType: string;
  usages: string[];
}

export interface PreparedAssetFile {
  targetPath: string;
  bytes: Buffer;
}

/*** Validate a portable design asset bundle before screen handoff or template writes. */
export async function prepareAssetBundle(
  bundlePath: string,
  manifest?: Record<string, unknown>,
): Promise<PreparedAssetFile[]> {
  const input: unknown = JSON.parse(await readFile(bundlePath, 'utf8'));
  assertRecord(input);
  if (!Array.isArray(input.assets) || !Array.isArray(input.screens)) {
    throw new Error('Asset bundle requires assets and screens arrays, including when empty.');
  }
  const assets = input.assets.map(parseAssetEntry);
  const ids = assets.map((asset) => asset.mediaId);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate asset mediaId.');
  if (manifest) validateManifestAssets(assets, manifest);
  const root = dirname(resolve(bundlePath));
  const files = await Promise.all(
    assets.map(async (asset) => {
      const bytes = await readAssetFile(root, asset.sourcePath);
      assertImageContent(bytes, asset.contentType);
      return { targetPath: asset.targetPath, bytes };
    }),
  );
  for (const screen of input.screens) {
    assertRecord(screen);
    const sourcePath = requireString(screen.sourcePath);
    const targetPath = requireString(screen.targetPath);
    assertAssetPath(sourcePath, 'assets/screens/');
    assertAssetPath(targetPath, 'assets/screens/');
    files.push({ targetPath, bytes: await readAssetFile(root, sourcePath) });
  }
  if (new Set(files.map((file) => file.targetPath.toLowerCase())).size !== files.length) {
    throw new Error('Duplicate asset targetPath.');
  }
  return files;
}

/*** Parse one generated runtime asset and its manifest JSON-pointer usages. */
function parseAssetEntry(value: unknown): AssetEntry {
  assertRecord(value);
  if (value.role !== 'icon' && value.role !== 'image')
    throw new Error('Asset role must be icon or image.');
  const sourcePath = requireString(value.sourcePath);
  const targetPath = requireString(value.targetPath);
  const contentType = requireString(value.contentType);
  const prefix = value.role === 'icon' ? 'assets/images/svg/' : 'assets/images/';
  assertAssetPath(sourcePath, prefix);
  assertAssetPath(targetPath, prefix);
  if (value.role === 'icon' && contentType !== 'image/svg+xml')
    throw new Error('Icon assets must be SVG.');
  const extensions: Partial<Record<string, string[]>> = {
    'image/svg+xml': ['svg'],
    'image/png': ['png'],
    'image/jpeg': ['jpg', 'jpeg'],
    'image/webp': ['webp'],
  };
  if (
    ![sourcePath, targetPath].every((path) =>
      extensions[contentType]?.includes(path.split('.').at(-1) ?? ''),
    )
  ) {
    throw new Error('Asset extension must match contentType.');
  }
  if (!Array.isArray(value.usages) || value.usages.length === 0)
    throw new Error('Asset usages must identify at least one manifest reference.');
  const usages = value.usages.map(requireString);
  if (usages.some((path) => !path.startsWith('/') || path.startsWith('/media/')))
    throw new Error('Asset usages must point to runtime consumers outside /media/.');
  return {
    mediaId: requireString(value.mediaId),
    role: value.role,
    sourcePath,
    targetPath,
    contentType,
    usages,
  };
}

/*** Match bundled files to registered media and actual runtime references. */
function validateManifestAssets(assets: AssetEntry[], manifest: Record<string, unknown>): void {
  const media = manifest.media ?? {};
  assertRecord(media);
  const registry = media.assets ?? {};
  assertRecord(registry);
  for (const [id, definition] of Object.entries(registry)) {
    assertRecord(definition);
    assertRecord(definition.source);
    if (definition.source.kind !== 'bundled') continue;
    const asset = assets.find((entry) => entry.mediaId === id);
    if (
      !asset ||
      definition.id !== id ||
      definition.kind !== 'image' ||
      definition.source.path !== asset.targetPath ||
      definition.contentType !== asset.contentType
    ) {
      throw new Error(`Bundled media must match an asset entry: ${id}`);
    }
  }
  for (const asset of assets) {
    const definition = registry[asset.mediaId];
    assertRecord(definition);
    assertRecord(definition.source);
    if (definition.source.kind !== 'bundled')
      throw new Error(`Asset must register bundled media: ${asset.mediaId}`);
    for (const usage of asset.usages) {
      const reference = resolvePointer(manifest, usage);
      assertRecord(reference);
      if (reference.mediaId !== asset.mediaId)
        throw new Error(`Asset usage does not reference ${asset.mediaId}: ${usage}`);
    }
  }
  const { media: _media, ...runtime } = manifest;
  validateReferences(runtime, registry);
}

/*** Reject dangling media references anywhere in runtime manifest content. */
function validateReferences(value: unknown, registry: Record<string, unknown>): void {
  if (Array.isArray(value)) {
    value.forEach((item) => validateReferences(item, registry));
    return;
  }
  if (typeof value !== 'object' || value === null) return;
  if (
    'mediaId' in value &&
    typeof value.mediaId === 'string' &&
    !Object.hasOwn(registry, value.mediaId)
  )
    throw new Error(`Unknown runtime mediaId: ${value.mediaId}`);
  Object.values(value).forEach((item) => validateReferences(item, registry));
}

/*** Resolve a standard JSON pointer without evaluating paths as code. */
function resolvePointer(root: unknown, pointer: string): unknown {
  return pointer
    .slice(1)
    .split('/')
    .reduce<unknown>((value, segment) => {
      const key = segment.replaceAll('~1', '/').replaceAll('~0', '~');
      if (Array.isArray(value)) return value[Number(key)];
      assertRecord(value);
      return value[key];
    }, root);
}

/*** Require a JSON object at the asset input boundary. */
function assertRecord(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error('Expected an asset or media object.');
}

/*** Require a nonempty asset input string. */
function requireString(value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '')
    throw new Error('Expected a nonempty asset string.');
  return value;
}

/*** Validate one asset bundle, optionally against a complete manifest. */
async function main(): Promise<void> {
  const [bundlePath, manifestPath] = process.argv.slice(2);
  if (!bundlePath) throw new Error('Usage: asset-bundle.ts <design-assets.json> [manifest.json]');
  const manifest: unknown = manifestPath
    ? JSON.parse(await readFile(manifestPath, 'utf8'))
    : undefined;
  if (manifest !== undefined) assertRecord(manifest);
  const files = await prepareAssetBundle(bundlePath, manifest);
  console.log(
    JSON.stringify(
      {
        status: 'pass',
        scope: manifest ? 'files-and-references' : 'files',
        files: files.map((file) => file.targetPath),
      },
      null,
      2,
    ),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
