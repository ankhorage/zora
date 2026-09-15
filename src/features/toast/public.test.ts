import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../authoring/componentMeta';

test('Toast stays imperative and installs its host only when the ZoraProvider capability is enabled', async () => {
  const [publicSource, providerSource, webCapabilities, nativeCapabilities] = await Promise.all([
    Bun.file('src/features/toast/public.ts').text(),
    Bun.file('src/features/theme/adapters/inbound/ZoraProvider.tsx').text(),
    Bun.file('src/features/theme/composition/ZoraRuntimeCapabilities.web.tsx').text(),
    Bun.file('src/features/theme/composition/ZoraRuntimeCapabilities.native.tsx').text(),
  ]);

  expect(ZORA_COMPONENT_META.Toast?.directManifestNode).toBe(false);
  expect(ZORA_COMPONENT_META.ToastProvider?.directManifestNode).toBe(false);
  expect(publicSource).toContain("useToast } from '@ankhorage/surface'");
  expect(providerSource).toContain('toast = false');
  expect(webCapabilities).toContain('if (!toast)');
  expect(nativeCapabilities).toContain('toast ?');
});
