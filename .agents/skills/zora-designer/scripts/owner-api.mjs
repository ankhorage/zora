#!/usr/bin/env bun

import { readFile } from 'node:fs/promises';
import { dirname, join, parse, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const OWNER_RELEASES = {
  templates: { packageName: '@ankhorage/templates', minimumVersion: '8.0.0' },
  zora: { packageName: '@ankhorage/zora', minimumVersion: '4.0.0' },
};

const OWNER_REQUIREMENTS = {
  templates: {
    ...OWNER_RELEASES.templates,
    specifier: '@ankhorage/templates',
    exports: [
      'CATEGORY_PRESETS',
      'TONE_PAIR_CATALOG',
      'resolveTonePair',
      'resolveCategoryDesignPreset',
      'compileCategoryDesign',
      'composeCategoryAppManifest',
      'validateTemplateManifest',
      'assertTemplateManifestReady',
    ],
  },
  zoraTheme: {
    ...OWNER_RELEASES.zora,
    specifier: '@ankhorage/zora/theme',
    exports: ['compileZoraTheme'],
  },
  zoraMetadata: {
    ...OWNER_RELEASES.zora,
    specifier: '@ankhorage/zora/metadata',
    exports: ['ZORA_COMPONENT_META', 'ZORA_THEME_RECIPE_META'],
  },
};

/*** Load and validate every released owner API from one target repository. */
export async function loadOwnerApis(targetDirectory = process.cwd()) {
  const loaded = {};

  for (const [ownerKey, requirement] of Object.entries(OWNER_REQUIREMENTS)) {
    loaded[ownerKey] = await loadOwnerModule(targetDirectory, requirement);
  }

  return {
    templates: loaded.templates.module,
    zoraTheme: loaded.zoraTheme.module,
    zoraMetadata: loaded.zoraMetadata.module,
    versions: {
      templates: loaded.templates.version,
      zora: loaded.zoraTheme.version,
    },
  };
}

/*** Return installed catalogs and metadata names without copying owner definitions. */
export async function inspectOwnerApis(targetDirectory = process.cwd()) {
  const owners = await loadOwnerApis(targetDirectory);
  return {
    versions: owners.versions,
    categories: Object.values(owners.templates.CATEGORY_PRESETS).map((preset) => ({
      category: preset.category,
      label: preset.label,
      recommendedPrimaryColors: preset.recommendedPrimaryColors,
      recommendedHarmonies: preset.recommendedHarmonies,
      tonePairs: preset.tonePairs,
    })),
    tonePairs: owners.templates.TONE_PAIR_CATALOG,
    components: Object.keys(owners.zoraMetadata.ZORA_COMPONENT_META).sort(),
    themeRecipes: Object.keys(owners.zoraMetadata.ZORA_THEME_RECIPE_META).sort(),
  };
}

/*** Compile category design, validate region nodes, and compose one canonical draft or release manifest. */
export async function composeDesign(input, targetDirectory = process.cwd()) {
  const owners = await loadOwnerApis(targetDirectory);
  assertRecord(input, 'Design input');
  assertNonEmptyString(input.category, 'category');
  assertRecord(input.navigator, 'navigator');
  assertRecord(input.screens, 'screens');
  assertSupportedThemeRecipes(input.theme?.recipes, owners.zoraMetadata.ZORA_THEME_RECIPE_META);

  const regionResult = resolveRegionNodes(
    input.screens,
    Array.isArray(input.regions) ? input.regions : [],
    owners.zoraMetadata.ZORA_COMPONENT_META,
  );
  const design = owners.templates.compileCategoryDesign(input.category, input.theme ?? {});
  const { computedTheme, ...resolvedDesign } = design;
  const requestedAuthoringState = input.authoringState === 'release' ? 'release' : 'draft';
  const authoringState = regionResult.gaps.length === 0 ? requestedAuthoringState : 'draft';
  const composition = owners.templates.composeCategoryAppManifest({
    category: input.category,
    name: input.name,
    slug: input.slug,
    version: input.version,
    navigator: input.navigator,
    screens: regionResult.screens,
    dataSources: input.dataSources,
    dataBindings: input.dataBindings,
    modules: input.modules,
    modulesConfig: input.modulesConfig,
    theme: input.theme,
    authoringState,
  });
  const ownerDiagnostics = [
    ...design.diagnostics,
    ...computedTheme.diagnostics,
    ...composition.diagnostics,
  ];
  const blocked = regionResult.gaps.length > 0 || composition.status === 'blocked';

  return {
    owners: owners.versions,
    design: resolvedDesign,
    computedTheme,
    composition,
    regionDiagnostics: regionResult.diagnostics,
    ownerDiagnostics,
    requestedAuthoringState,
    applicationGate: blocked ? 'blocked' : 'pass',
    blockers: regionResult.gaps,
  };
}

/*** Resolve explicit region-to-component decisions and insert validated nodes into cloned screens. */
export function resolveRegionNodes(screens, regions, componentMeta) {
  const resolvedScreens = structuredClone(screens);
  const diagnostics = [];
  const gaps = [];

  for (const region of regions) {
    assertRecord(region, 'Region');
    assertNonEmptyString(region.id, 'region.id');
    assertNonEmptyString(region.screenId, 'region.screenId');
    assertNonEmptyString(region.requestedCapability, 'region.requestedCapability');
    const screen = resolvedScreens[region.screenId];
    if (!screen) {
      throw new Error(`Region "${region.id}" targets unknown screen "${region.screenId}".`);
    }

    const resolution = resolveRegionNode(region, componentMeta);
    insertRegionNode(screen, region.parentNodeId, resolution.node, componentMeta);
    diagnostics.push(resolution.diagnostic);
    if (resolution.gap !== null) {
      gaps.push(resolution.gap);
    }
  }

  return { screens: resolvedScreens, diagnostics, gaps };
}

/*** Resolve one exact metadata-backed component or the owner-defined MissingElement placeholder. */
function resolveRegionNode(region, componentMeta) {
  const component = typeof region.component === 'string' ? region.component : null;
  const meta = component === null ? null : componentMeta[component];
  if (meta && meta.directManifestNode && meta.manifestPolicy?.kind !== 'unresolved-element') {
    const props = assertSupportedProps(region.props ?? {}, meta, region.id);
    return {
      node: { id: region.id, type: meta.name, props },
      diagnostic: {
        regionId: region.id,
        status: 'matched',
        component: meta.name,
        evidenceId: region.evidenceId ?? null,
      },
      gap: null,
    };
  }

  const missingMeta = componentMeta.MissingElement;
  if (!missingMeta || missingMeta.manifestPolicy?.kind !== 'unresolved-element') {
    throw new Error(
      'Installed @ankhorage/zora metadata does not expose the canonical MissingElement contract.',
    );
  }
  const props = {
    ...(missingMeta.blueprint?.defaultProps ?? {}),
    requestedCapability: region.requestedCapability,
    reason:
      typeof region.reason === 'string' && region.reason.trim() !== ''
        ? region.reason
        : `No exact metadata-supported ZORA element was selected for region "${region.id}".`,
    ...(typeof region.evidenceId === 'string' ? { evidenceId: region.evidenceId } : {}),
  };
  assertSupportedProps(props, missingMeta, region.id);
  const gap = {
    id: `missing-element:${region.id}`,
    scope: 'composition',
    owner: '@ankhorage/zora',
    regionId: region.id,
    requestedCapability: region.requestedCapability,
    evidenceId: region.evidenceId ?? null,
    ownerIssueUrl: region.ownerIssueUrl ?? null,
    reason: props.reason,
    unblockCondition: 'Replace MissingElement with a released exact ZORA element and revalidate.',
  };
  return {
    node: { id: region.id, type: missingMeta.name, props },
    diagnostic: { regionId: region.id, status: 'missing', component: missingMeta.name, ...gap },
    gap,
  };
}

/*** Validate that manifest props are declared by the selected component metadata. */
function assertSupportedProps(props, meta, regionId) {
  assertRecord(props, `props for region "${regionId}"`);
  const unsupported = Object.keys(props).filter((name) => !(name in meta.props));
  if (unsupported.length > 0) {
    throw new Error(
      `Region "${regionId}" uses props absent from ZORA metadata for ${meta.name}: ${unsupported.join(', ')}.`,
    );
  }
  return props;
}

/*** Insert a region node under the declared parent or the target screen root. */
function insertRegionNode(screen, parentNodeId, node, componentMeta) {
  const parent =
    typeof parentNodeId === 'string' && parentNodeId !== ''
      ? findNode(screen.root, parentNodeId)
      : screen.root;
  if (!parent) {
    throw new Error(`Region parent node not found: ${String(parentNodeId)}`);
  }
  const parentMeta = componentMeta[parent.type];
  if (!parentMeta || !parentMeta.directManifestNode) {
    throw new Error(`Region parent "${parent.id}" is absent from direct ZORA manifest metadata.`);
  }
  if (!parentMeta.allowedChildren.includes(node.type)) {
    throw new Error(
      `ZORA metadata does not allow ${node.type} under ${parent.type} for parent "${parent.id}".`,
    );
  }
  parent.children = [...(Array.isArray(parent.children) ? parent.children : []), node];
}

/*** Validate persisted component and pattern recipe overrides against exact ZORA metadata fields. */
function assertSupportedThemeRecipes(recipes, recipeMeta) {
  if (recipes === undefined) return;
  assertRecord(recipes, 'theme.recipes');
  for (const [group, kind] of [
    ['components', 'component'],
    ['patterns', 'pattern'],
  ]) {
    const overrides = recipes[group];
    if (overrides === undefined) continue;
    assertRecord(overrides, `theme.recipes.${group}`);
    for (const [recipeName, fields] of Object.entries(overrides)) {
      const meta = recipeMeta[recipeName];
      if (!meta || meta.kind !== kind) {
        throw new Error(`Unknown ZORA ${kind} theme recipe: ${recipeName}.`);
      }
      assertRecord(fields, `theme recipe ${recipeName}`);
      for (const [fieldName, value] of Object.entries(fields)) {
        const fieldMeta = meta.fields[fieldName];
        if (!fieldMeta || !isRecipeValueSupported(value, fieldMeta)) {
          throw new Error(`Unsupported ZORA theme recipe value: ${recipeName}.${fieldName}.`);
        }
      }
    }
  }
}

/*** Validate one recipe value using its owner-defined boolean, choice, or token field metadata. */
function isRecipeValueSupported(value, fieldMeta) {
  if (fieldMeta.type === 'boolean') return typeof value === 'boolean';
  if (typeof value !== 'string') return false;
  return fieldMeta.type !== 'choice' || fieldMeta.options.includes(value);
}

/*** Find a manifest node recursively by stable node ID. */
function findNode(node, nodeId) {
  if (node.id === nodeId) return node;
  for (const child of Array.isArray(node.children) ? node.children : []) {
    const found = findNode(child, nodeId);
    if (found) return found;
  }
  return null;
}

/*** Resolve, version-check, and import one public owner module from the target repository. */
async function loadOwnerModule(targetDirectory, requirement) {
  let packageManifestPath;
  try {
    packageManifestPath = await findInstalledPackageManifest(
      targetDirectory,
      requirement.packageName,
    );
  } catch (error) {
    throw ownerError(
      requirement,
      'is not installed or does not export the required public subpath',
      error,
    );
  }

  const packageManifest = JSON.parse(await readFile(packageManifestPath, 'utf8'));
  const version = packageManifest.version;
  if (typeof version !== 'string' || compareVersions(version, requirement.minimumVersion) < 0) {
    throw ownerError(
      requirement,
      `is outdated (found ${String(version)}, requires >=${requirement.minimumVersion})`,
    );
  }
  const modulePath = resolvePublicExportPath(
    packageManifest,
    packageManifestPath,
    requirement.specifier,
    requirement,
  );
  const ownerModule = await import(pathToFileURL(modulePath).href);
  const missingExports = requirement.exports.filter((name) => !(name in ownerModule));
  if (missingExports.length > 0) {
    throw ownerError(requirement, `is missing public exports: ${missingExports.join(', ')}`);
  }
  return { module: ownerModule, version };
}

/*** Find the nearest installed package manifest without falling back to the skill's own tree. */
async function findInstalledPackageManifest(targetDirectory, packageName) {
  const resolvedTarget = resolve(targetDirectory);
  const selfManifestPath = join(resolvedTarget, 'package.json');
  try {
    const selfManifest = JSON.parse(await readFile(selfManifestPath, 'utf8'));
    if (selfManifest.name === packageName) return selfManifestPath;
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
  }

  const filesystemRoot = parse(resolvedTarget).root;
  let directory = resolvedTarget;
  while (true) {
    const candidate = join(directory, 'node_modules', ...packageName.split('/'), 'package.json');
    try {
      await readFile(candidate, 'utf8');
      return candidate;
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
    if (directory === filesystemRoot) break;
    directory = dirname(directory);
  }
  throw new Error(`Package not installed from target root: ${packageName}`);
}

/*** Resolve one import-condition public export from an installed package manifest. */
function resolvePublicExportPath(packageManifest, packageManifestPath, specifier, requirement) {
  const exportKey =
    specifier === requirement.packageName
      ? '.'
      : `./${specifier.slice(requirement.packageName.length + 1)}`;
  const exportsField = packageManifest.exports;
  const rawExport = isRecord(exportsField) ? exportsField[exportKey] : null;
  const exportTarget = selectImportExportTarget(rawExport);
  if (exportTarget === null || !exportTarget.startsWith('./')) {
    throw ownerError(requirement, `does not expose the import target for ${specifier}`);
  }
  return resolve(dirname(packageManifestPath), exportTarget);
}

/*** Select the canonical ESM import target without resolving a CommonJS compatibility condition. */
function selectImportExportTarget(rawExport) {
  if (typeof rawExport === 'string') return rawExport;
  if (!isRecord(rawExport)) return null;
  for (const condition of ['import', 'default', 'bun', 'browser', 'react-native']) {
    if (typeof rawExport[condition] === 'string') return rawExport[condition];
  }
  return null;
}

/*** Create an actionable released-owner diagnostic without offering a compatibility fallback. */
function ownerError(requirement, detail, cause) {
  return new Error(
    `zora-designer requires ${requirement.packageName} >=${requirement.minimumVersion}; ${detail}. ` +
      `Update the target dependency through its normal Renovate/release workflow and rerun inspection.`,
    cause === undefined ? undefined : { cause },
  );
}

/*** Compare stable semantic versions needed by the released public API gates. */
function compareVersions(left, right) {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let index = 0; index < 3; index += 1) {
    const difference = leftParts[index] - rightParts[index];
    if (difference !== 0) return difference;
  }
  return 0;
}

/*** Parse the numeric major, minor, and patch tuple from a semantic version. */
function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/u.exec(version);
  if (!match) return [-1, -1, -1];
  return match.slice(1, 4).map(Number);
}

/*** Require an object-shaped input value. */
function assertRecord(value, label) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

/*** Narrow unknown package export metadata to a record. */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/*** Require a non-empty string input field. */
function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

/*** Run the portable command-line interface when this file is executed directly. */
async function main() {
  const [command, inputPath] = process.argv.slice(2);
  if (command === 'inspect') {
    console.log(JSON.stringify(await inspectOwnerApis(), null, 2));
    return;
  }
  if (command === 'compose' && inputPath) {
    const input = JSON.parse(await readFile(inputPath, 'utf8'));
    console.log(JSON.stringify(await composeDesign(input), null, 2));
    return;
  }
  throw new Error('Usage: owner-api.mjs inspect | owner-api.mjs compose <input.json>');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
