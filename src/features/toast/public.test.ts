import { expect, test } from 'bun:test';

import { toastMeta } from './toastMeta';
import { toastProviderMeta } from './toastProviderMeta';

test('Toast stays imperative and installs its host only when the ZoraProvider capability is enabled', async () => {
  const [publicSource, providerSource, webCapabilities, nativeCapabilities] = await Promise.all([
    Bun.file('src/features/toast/public.ts').text(),
    Bun.file('src/features/theme/adapters/inbound/ZoraProvider.tsx').text(),
    Bun.file('src/features/theme/composition/ZoraRuntimeCapabilities.web.tsx').text(),
    Bun.file('src/features/theme/composition/ZoraRuntimeCapabilities.native.tsx').text(),
  ]);

  expect(toastMeta.directManifestNode).toBe(false);
  expect(toastProviderMeta.directManifestNode).toBe(false);
  expect(publicSource).toContain("useToast } from '@ankhorage/surface'");
  expect(providerSource).toContain('toast = false');
  expect(webCapabilities).toContain('if (!toast)');
  expect(nativeCapabilities).toContain('toast ?');
});
