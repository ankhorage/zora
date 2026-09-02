#!/usr/bin/env bun

import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

import { loadOwnerApis } from './owner-api.mjs';

/*** Validate and scaffold one ready authored manifest into the normal Templates variant layout. */
export async function scaffoldTemplate(input) {
  assertRecord(input, 'Scaffold input');
  for (const field of ['targetDirectory', 'category', 'templateId', 'label', 'description']) {
    assertNonEmptyString(input[field], field);
  }
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(input.templateId) ||
    ['default', 'starter'].includes(input.templateId)
  ) {
    throw new Error('templateId must be a non-reserved kebab-case identifier.');
  }
  assertRecord(input.manifest, 'manifest');

  const targetDirectory = resolve(input.targetDirectory);
  const packageManifest = JSON.parse(await readFile(join(targetDirectory, 'package.json'), 'utf8'));
  if (packageManifest.name !== '@ankhorage/templates') {
    throw new Error(
      'Template scaffolding is available only in the @ankhorage/templates repository.',
    );
  }
  if (input.manifest.metadata?.category !== input.category) {
    throw new Error('Scaffold category must match manifest.metadata.category.');
  }

  const owners = await loadOwnerApis(targetDirectory);
  const composition = owners.templates.validateTemplateManifest(input.manifest, 'release');
  if (composition.status !== 'ready') {
    throw new Error(
      `Manifest is not release-ready: ${composition.diagnostics.map((item) => item.message).join('; ')}`,
    );
  }
  const manifest = owners.templates.assertTemplateManifestReady(composition);
  const categoryDirectoryName = input.category.replaceAll('_', '-');
  const categoryDirectory = resolve(
    targetDirectory,
    'src/templates/starter/categories',
    categoryDirectoryName,
  );
  assertInside(targetDirectory, categoryDirectory);
  const variantDirectory = resolve(categoryDirectory, input.templateId);
  assertInside(categoryDirectory, variantDirectory);
  if (await pathExists(variantDirectory)) {
    throw new Error(
      `Template source already exists: ${relative(targetDirectory, variantDirectory)}`,
    );
  }

  const registryPath = join(categoryDirectory, 'index.ts');
  const registrySource = await readFile(registryPath, 'utf8');
  const symbol = toPascalCase(input.templateId);
  const factoryBase = symbol.endsWith('Starter') ? symbol.slice(0, -'Starter'.length) : symbol;
  const factoryName = `create${factoryBase}StarterTemplate`;
  const manifestName = `AUTHORED_${toConstantCase(input.templateId)}_MANIFEST`;
  const registrySourceUpdated = updateCategoryRegistry(registrySource, {
    templateId: input.templateId,
    label: input.label,
    description: input.description,
    factoryName,
  });
  const files = createTemplateFiles({ manifest, manifestName, factoryName });

  await mkdir(variantDirectory, { recursive: true });
  for (const [fileName, contents] of Object.entries(files)) {
    await writeFile(join(variantDirectory, fileName), contents);
  }
  await writeFile(registryPath, registrySourceUpdated);

  return {
    targetDirectory,
    registryPath: relative(targetDirectory, registryPath),
    createdFiles: Object.keys(files).map((fileName) =>
      relative(targetDirectory, join(variantDirectory, fileName)),
    ),
    factoryName,
  };
}

/*** Create normal manifest, factory, and entrypoint source for one authored starter variant. */
function createTemplateFiles({ manifest, manifestName, factoryName }) {
  const manifestSource = `import type { AppManifest } from '@ankhorage/contracts';

export const ${manifestName} = ${JSON.stringify(manifest, null, 2)} satisfies AppManifest;
`;
  const templateSource = `import type { AppManifest } from '@ankhorage/contracts';

import type { TemplateSeed } from '../../../starter.types';
import { ${manifestName} } from './manifest';

/*** Create the authored starter while applying the caller's canonical app identity and theme. */
export function ${factoryName}(seed: TemplateSeed): AppManifest {
  const theme = seed.theme ?? ${manifestName}.themes[0];
  if (theme === undefined) {
    throw new Error('The authored template requires one resolved theme.');
  }
  return {
    ...${manifestName},
    metadata: {
      ...${manifestName}.metadata,
      name: seed.appName,
      slug: seed.slug,
      version: seed.version ?? ${manifestName}.metadata.version,
      themeId: theme.id,
    },
    themes: [theme],
    activeThemeId: theme.id,
  };
}
`;
  return {
    'index.ts': `export { ${factoryName} } from './template';\n`,
    'manifest.ts': manifestSource,
    'template.ts': templateSource,
  };
}

/*** Add one stable import and definition to an existing category registry. */
function updateCategoryRegistry(source, definition) {
  const importLine = `import { ${definition.factoryName} } from './${definition.templateId}';`;
  if (source.includes(`id: '${definition.templateId}'`) || source.includes(importLine)) {
    throw new Error(`Template is already registered: ${definition.templateId}`);
  }
  const exportMarker = '\nexport const ';
  const exportIndex = source.indexOf(exportMarker);
  if (exportIndex < 0) {
    throw new Error('Category registry does not expose its canonical template array.');
  }
  const prefixLines = source.slice(0, exportIndex).trimEnd().split('\n');
  const relativeImports = [
    ...prefixLines.filter((line) => /^import .* from '\.\//u.test(line)),
    importLine,
  ].sort((left, right) => left.localeCompare(right));
  const preservedPrefix = prefixLines.filter((line) => !/^import .* from '\.\//u.test(line));
  const withImport = `${[...preservedPrefix, ...relativeImports].join('\n')}\n${source.slice(exportIndex + 1)}`;
  const closeMarker = '] satisfies readonly CategoryStarterTemplateDefinition[];';
  const closeIndex = withImport.indexOf(closeMarker);
  if (closeIndex < 0) {
    throw new Error('Category registry is missing its canonical definition-array terminator.');
  }
  const entry = `  {
    id: '${escapeSingleQuoted(definition.templateId)}',
    label: '${escapeSingleQuoted(definition.label)}',
    description: '${escapeSingleQuoted(definition.description)}',
    create: ${definition.factoryName},
  },
`;
  return `${withImport.slice(0, closeIndex)}${entry}${withImport.slice(closeIndex)}`;
}

/*** Convert kebab-case identifiers to a PascalCase source symbol. */
function toPascalCase(value) {
  return value
    .split('-')
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join('');
}

/*** Convert kebab-case identifiers to an uppercase constant name. */
function toConstantCase(value) {
  return value.replaceAll('-', '_').toUpperCase();
}

/*** Escape content placed in generated single-quoted TypeScript strings. */
function escapeSingleQuoted(value) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

/*** Assert that a resolved output remains inside its declared owner directory. */
function assertInside(parentDirectory, childPath) {
  const relativePath = relative(parentDirectory, childPath);
  if (relativePath === '' || relativePath.startsWith(`..${sep}`) || relativePath === '..') {
    throw new Error(`Scaffold path escapes its owner directory: ${childPath}`);
  }
}

/*** Return whether a filesystem path already exists. */
async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return false;
    throw error;
  }
}

/*** Require a non-array object input. */
function assertRecord(value, label) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

/*** Require a non-empty string input field. */
function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

/*** Run deterministic Templates source scaffolding from one JSON input. */
async function main() {
  const [inputPath] = process.argv.slice(2);
  if (!inputPath) throw new Error('Usage: scaffold-template.mjs <scaffold-input.json>');
  const input = JSON.parse(await readFile(inputPath, 'utf8'));
  console.log(JSON.stringify(await scaffoldTemplate(input), null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
