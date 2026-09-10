import { describe, expect, test } from 'bun:test';

describe('ZORA Uploader public contract', () => {
  test('publishes the generic uploader through root and explicit subpath APIs', async () => {
    const packageJson = (await Bun.file('package.json').json()) as {
      dependencies: Readonly<Record<string, string>>;
      exports: Readonly<Record<string, unknown>>;
    };
    const [rootSource, publicSource] = await Promise.all([
      Bun.file('src/index.ts').text(),
      Bun.file('src/features/uploader/public.ts').text(),
    ]);

    expect(packageJson.exports['./uploader']).toBeDefined();
    expect(packageJson.dependencies['expo-image-picker']).toMatch(/^~57\./u);
    expect(packageJson.dependencies['expo-document-picker']).toMatch(/^~57\./u);
    expect(rootSource).toContain("from './features/uploader/public'");
    expect(publicSource).toContain('export { Uploader }');
    expect(publicSource).toContain('export { validateUploadAsset }');
  });

  test('removes the superseded image preview and upload field APIs', async () => {
    const [rootSource, registrySource, metadataSource] = await Promise.all([
      Bun.file('src/index.ts').text(),
      Bun.file('src/registry.ts').text(),
      Bun.file('src/metadata/componentMeta.ts').text(),
    ]);
    const publicSurface = `${rootSource}\n${registrySource}\n${metadataSource}`;

    expect(publicSurface).not.toContain('ImagePreview');
    expect(publicSurface).not.toContain('ImageUploadField');
    expect(publicSurface).toContain('Uploader');
  });
});
