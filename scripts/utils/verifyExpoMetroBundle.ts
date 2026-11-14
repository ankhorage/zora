import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { assert } from './assert';

const expoNativeVirtualEntryPath = '/.expo/.virtual-metro-entry.bundle';
const maximumDiagnosticExcerptBytes = 4_096;
const fatalMetroBundlePattern =
  /(?:CommandError:|Unable to resolve module|UnableToResolveError|TransformError|Failed to construct transformer|TypeScript but don't have)/;

export type ExpoNativePlatform = 'android' | 'ios';

/** Create Expo 57's platform-native virtual-entry request instead of assuming an index module exists. */
export function createExpoNativeBundleUrl(port: number, platform: ExpoNativePlatform): URL {
  const url = new URL(`http://127.0.0.1:${port}${expoNativeVirtualEntryPath}`);
  url.searchParams.set('platform', platform);
  url.searchParams.set('dev', 'true');
  url.searchParams.set('minify', 'false');
  url.searchParams.set('modulesOnly', 'false');
  url.searchParams.set('runModule', 'true');
  return url;
}

/** Recognize the Expo-native request shape so a literal Metro module URL cannot replace the virtual entry. */
export function isExpoNativeBundleUrl(url: URL, platform: ExpoNativePlatform): boolean {
  return (
    url.pathname === expoNativeVirtualEntryPath &&
    url.searchParams.get('platform') === platform &&
    url.searchParams.get('dev') === 'true' &&
    url.searchParams.get('minify') === 'false' &&
    url.searchParams.get('modulesOnly') === 'false' &&
    url.searchParams.get('runModule') === 'true'
  );
}

/** Prove Metro compiled the Expo native root and the installed packed FlowCanvas module into an executable bundle. */
export async function verifyExpoMetroBundleAsync(
  input: Readonly<{
    diagnosticRoot: string;
    platform: ExpoNativePlatform;
    port: number;
  }>,
) {
  const url = createExpoNativeBundleUrl(input.port, input.platform);
  assert(
    isExpoNativeBundleUrl(url, input.platform),
    `Invalid Expo ${input.platform} native bundle URL: ${url.toString()}.`,
  );
  const response = await fetch(url);
  const bundle = await response.text();
  const bytes = new TextEncoder().encode(bundle);
  const diagnostic = {
    byteCount: bytes.byteLength,
    excerpt: bundle.slice(0, maximumDiagnosticExcerptBytes),
    headers: Object.fromEntries(response.headers.entries()),
    requestedUrl: url.toString(),
    responseUrl: response.url,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    status: response.status,
    statusText: response.statusText,
  };
  mkdirSync(input.diagnosticRoot, { recursive: true });
  writeFileSync(
    join(input.diagnosticRoot, `metro-${input.platform}-bundle.json`),
    `${JSON.stringify(diagnostic, null, 2)}\n`,
  );
  assert(
    response.ok,
    `Metro did not serve the ${input.platform} application bundle: HTTP ${response.status}. See metro-${input.platform}-bundle.json.`,
  );
  assert(bytes.byteLength > 0, `Metro served an empty ${input.platform} application bundle.`);
  assert(
    !fatalMetroBundlePattern.test(bundle.slice(0, maximumDiagnosticExcerptBytes)),
    'Metro returned a fatal dependency or resolution error instead of the application bundle.',
  );
  assert(
    bundle.includes('node_modules/@ankhorage/zora/src/features/flow/public'),
    'Metro bundle did not consume the installed packed @ankhorage/zora/flow public module.',
  );
}
