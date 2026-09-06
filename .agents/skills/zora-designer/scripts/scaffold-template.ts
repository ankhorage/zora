#!/usr/bin/env bun

import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

import { generateTemplateCatalog } from './generate-template-catalog.ts';
import { loadOwnerApis } from './owner-api.ts';

/*** Scaffold one complete portable template and refresh filesystem discovery. */
export async function scaffoldTemplate(input: unknown) {
  assertRecord(input, 'Scaffold input');
  assertNonEmptyString(input.targetDirectory, 'targetDirectory');
  assertNonEmptyString(input.category, 'category');
  assertNonEmptyString(input.slug, 'slug');
  assertNonEmptyString(input.assetBundlePath, 'assetBundlePath');
  const { category, slug, targetDirectory: inputTargetDirectory } = input;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) {
    throw new Error('slug must be a kebab-case identifier.');
  }
  assertRecord(input.manifest, 'manifest');
  const { manifest: inputManifest } = input;

  const targetDirectory = resolve(inputTargetDirectory);
  const packageManifest: unknown = JSON.parse(
    await readFile(join(targetDirectory, 'package.json'), 'utf8'),
  );
  assertRecord(packageManifest, 'Target package manifest');
  if (packageManifest.name !== '@ankhorage/templates') {
    throw new Error(
      'Template scaffolding is available only in the @ankhorage/templates repository.',
    );
  }
  assertRecord(inputManifest.metadata, 'manifest.metadata');
  if (inputManifest.metadata.category !== category) {
    throw new Error('Scaffold category must match manifest.metadata.category.');
  }
  if (inputManifest.metadata.slug !== slug) {
    throw new Error('Scaffold slug must match manifest.metadata.slug.');
  }

  const owners = await loadOwnerApis(targetDirectory);
  const composition = owners.templates.validateTemplateManifest(inputManifest, 'release');
  const manifest = owners.templates.assertTemplateManifestReady(composition);
  const assetFiles = await prepareAssetBundle(
    resolve(targetDirectory, input.assetBundlePath),
    manifest,
  );

  const categoryDirectory = resolve(
    targetDirectory,
    'src/templates/categories',
    category.replaceAll('_', '-'),
  );
  assertInside(targetDirectory, categoryDirectory);

  const templateDirectory = resolve(categoryDirectory, slug);
  assertInside(categoryDirectory, templateDirectory);
  if (await pathExists(templateDirectory)) {
    throw new Error(
      `Template source already exists: ${relative(targetDirectory, templateDirectory)}`,
    );
  }

  const screensDirectory = join(templateDirectory, 'assets', 'screens');
  const imagesDirectory = join(templateDirectory, 'assets', 'images');
  const svgDirectory = join(imagesDirectory, 'svg');
  await mkdir(screensDirectory, { recursive: true });
  await mkdir(svgDirectory, { recursive: true });
  for (const file of assetFiles) {
    const destination = join(templateDirectory, file.targetPath);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, file.bytes, { flag: 'wx' });
  }
  await writeFile(
    join(templateDirectory, 'createAppManifest.ts'),
    createManifestSource(manifest),
    'utf8',
  );
  await rm(join(categoryDirectory, '.gitkeep'), { force: true });
  await generateTemplateCatalog(targetDirectory, owners.contracts.APP_CATEGORIES);

  return {
    targetDirectory,
    templateDirectory: relative(targetDirectory, templateDirectory),
    createdFiles: [
      relative(targetDirectory, join(templateDirectory, 'createAppManifest.ts')),
      ...assetFiles.map((file) =>
        relative(targetDirectory, join(templateDirectory, file.targetPath)),
      ),
    ],
    assetDirectories: [
      relative(targetDirectory, screensDirectory),
      relative(targetDirectory, imagesDirectory),
      relative(targetDirectory, svgDirectory),
    ],
  };
}

/*** Serialize one complete manifest as the template's canonical default export. */
function createManifestSource(manifest: Record<string, unknown>): string {
  return `import type { AppManifest } from '@ankhorage/contracts';

const manifest = ${JSON.stringify(manifest, null, 2)} satisfies AppManifest;

/*** Create the complete portable application manifest for this template. */
export default function createAppManifest(): AppManifest {
  return structuredClone(manifest);
}
`;
}

/*** Assert that a resolved output remains inside its declared owner directory. */
function assertInside(parentPath: string, childPath: string): void {
  const relativePath = relative(parentPath, childPath);
  if (
    relativePath === '' ||
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`) ||
    relativePath.startsWith('../')
  ) {
    throw new Error(`Template path escapes its owner directory: ${childPath}`);
  }
}

/*** Return whether a filesystem path exists. */
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/*** Require a non-array object input. */
function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

/*** Require a non-empty string input field. */
function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

/*** Run deterministic Templates source scaffolding from one JSON input. */
async function main() {
  const [inputPath] = process.argv.slice(2);
  if (!inputPath) {
    throw new Error('Usage: scaffold-template.ts <scaffold-input.json>');
  }
  const input: unknown = JSON.parse(await readFile(resolve(inputPath), 'utf8'));
  console.log(JSON.stringify(await scaffoldTemplate(input), null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
import { prepareAssetBundle } from './asset-bundle.ts';
