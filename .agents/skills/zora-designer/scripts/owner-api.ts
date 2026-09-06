#!/usr/bin/env bun

import { readFile } from 'node:fs/promises';
import { dirname, join, parse, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

interface OwnerRequirement {
  exports: readonly string[];
  minimumVersion: string;
  packageName: string;
  specifier: string;
}

interface Diagnostic extends Record<string, unknown> {
  severity?: unknown;
}

interface ComputedTheme extends Record<string, unknown> {
  diagnostics: Diagnostic[];
}

interface DesignCompilation extends Record<string, unknown> {
  computedTheme: ComputedTheme;
  diagnostics: Diagnostic[];
}

interface ManifestComposition extends Record<string, unknown> {
  diagnostics: Diagnostic[];
  status: string;
}

interface ColorTheoryApi extends Record<string, unknown> {
  COLOR_HARMONIES: readonly string[];
  COLOR_HARMONY_CATALOG: readonly Record<string, unknown>[];
}

interface ContractsApi extends Record<string, unknown> {
  APP_CATEGORIES: readonly string[];
  NAVIGATOR_TYPES: readonly string[];
}

interface TemplatesApi extends Record<string, unknown> {
  CATEGORY_PRESETS: Record<string, Record<string, unknown>>;
  TONE_PAIR_CATALOG: readonly Record<string, unknown>[];
  assertTemplateManifestReady: (composition: ManifestComposition) => Record<string, unknown>;
  compileCategoryDesign: (category: string, theme: Record<string, unknown>) => DesignCompilation;
  composeCategoryAppManifest: (input: Record<string, unknown>) => ManifestComposition;
  resolveCategoryDesignPreset: (...arguments_: unknown[]) => unknown;
  resolveTonePair: (...arguments_: unknown[]) => unknown;
  validateTemplateManifest: (
    manifest: Record<string, unknown>,
    authoringState: string,
  ) => ManifestComposition;
}

interface ZoraThemeApi extends Record<string, unknown> {
  compileZoraTheme: (...arguments_: unknown[]) => unknown;
}

interface EventMetadata extends Record<string, unknown> {
  description: string;
  eventType: string;
  label: string;
  payloadFields?: unknown;
}

interface ComponentMetadata extends Record<string, unknown> {
  allowedChildren: readonly string[];
  directManifestNode: boolean;
  events?: Record<string, EventMetadata>;
  manifestPolicy?: { kind?: unknown };
  name: string;
  props: Record<string, unknown>;
}

interface RecipeFieldMetadata extends Record<string, unknown> {
  options?: readonly string[];
  type: string;
}

interface RecipeMetadata extends Record<string, unknown> {
  fields: Record<string, RecipeFieldMetadata | undefined>;
  kind: string;
}

interface ZoraMetadataApi extends Record<string, unknown> {
  ZORA_COMPONENT_META: Record<string, ComponentMetadata | undefined>;
  ZORA_THEME_RECIPE_META: Record<string, RecipeMetadata | undefined>;
}

interface ManifestNode extends Record<string, unknown> {
  children?: ManifestNode[];
  id: string;
  props?: Record<string, unknown>;
  type: string;
}

interface ManifestScreen extends Record<string, unknown> {
  root: ManifestNode;
}

interface Region extends Record<string, unknown> {
  component?: unknown;
  evidenceId?: unknown;
  id: string;
  parentNodeId?: unknown;
  props?: unknown;
  reason?: unknown;
  requestedCapability: string;
  screenId: string;
}

interface LoadedOwnerModule {
  module: Record<string, unknown>;
  version: string;
}

const OWNER_RELEASES = {
  colorTheory: { packageName: '@ankhorage/color-theory', minimumVersion: '0.3.0' },
  contracts: { packageName: '@ankhorage/contracts', minimumVersion: '10.1.0' },
  templates: { packageName: '@ankhorage/templates', minimumVersion: '9.3.0' },
  zora: { packageName: '@ankhorage/zora', minimumVersion: '4.2.0' },
};

const OWNER_REQUIREMENTS = {
  colorTheory: {
    ...OWNER_RELEASES.colorTheory,
    specifier: '@ankhorage/color-theory',
    exports: ['COLOR_HARMONIES', 'COLOR_HARMONY_CATALOG'],
  },
  contracts: {
    ...OWNER_RELEASES.contracts,
    specifier: '@ankhorage/contracts',
    exports: ['APP_CATEGORIES', 'NAVIGATOR_TYPES'],
  },
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

/*** Expose the runtime owner gates so tests and callers never duplicate managed versions. */
export function inspectOwnerRequirements() {
  return structuredClone(OWNER_RELEASES);
}

/*** Load and validate every released owner API from one target repository. */
export async function loadOwnerApis(targetDirectory = process.cwd()) {
  const colorTheory = await loadOwnerModule(targetDirectory, OWNER_REQUIREMENTS.colorTheory);
  const contracts = await loadOwnerModule(targetDirectory, OWNER_REQUIREMENTS.contracts);
  const templates = await loadOwnerModule(targetDirectory, OWNER_REQUIREMENTS.templates);
  const zoraTheme = await loadOwnerModule(targetDirectory, OWNER_REQUIREMENTS.zoraTheme);
  const zoraMetadata = await loadOwnerModule(targetDirectory, OWNER_REQUIREMENTS.zoraMetadata);
  assertColorTheoryApi(colorTheory.module);
  assertContractsApi(contracts.module);
  assertTemplatesApi(templates.module);
  assertZoraThemeApi(zoraTheme.module);
  assertZoraMetadataApi(zoraMetadata.module);

  return {
    colorTheory: colorTheory.module,
    contracts: contracts.module,
    templates: templates.module,
    zoraTheme: zoraTheme.module,
    zoraMetadata: zoraMetadata.module,
    versions: {
      colorTheory: colorTheory.version,
      contracts: contracts.version,
      templates: templates.version,
      zora: zoraTheme.version,
    },
  };
}

/*** Load only Contracts for tooling that runs before another owner package has been built. */
export async function loadContractsApi(targetDirectory = process.cwd()): Promise<ContractsApi> {
  const loaded = await loadOwnerModule(targetDirectory, OWNER_REQUIREMENTS.contracts);
  assertContractsApi(loaded.module);
  return loaded.module;
}

/*** Return installed catalogs and metadata names without copying owner definitions. */
export async function inspectOwnerApis(targetDirectory = process.cwd()) {
  const owners = await loadOwnerApis(targetDirectory);
  const componentMetadata = Object.values(owners.zoraMetadata.ZORA_COMPONENT_META).filter(
    (metadata) => metadata !== undefined,
  );
  return {
    versions: owners.versions,
    appCategories: owners.contracts.APP_CATEGORIES,
    categoryPresets: owners.templates.CATEGORY_PRESETS,
    harmonyIds: owners.colorTheory.COLOR_HARMONIES,
    harmonies: owners.colorTheory.COLOR_HARMONY_CATALOG,
    tonePairs: owners.templates.TONE_PAIR_CATALOG,
    navigatorTypes: owners.contracts.NAVIGATOR_TYPES,
    components: componentMetadata.map((meta) => meta.name).sort(),
    events: componentMetadata
      .flatMap((meta) =>
        Object.values(meta.events ?? {}).map((event) => ({
          component: meta.name,
          eventType: event.eventType,
          label: event.label,
          description: event.description,
          payloadFields: event.payloadFields,
        })),
      )
      .sort((left, right) =>
        `${left.component}:${left.eventType}`.localeCompare(
          `${right.component}:${right.eventType}`,
        ),
      ),
    themeRecipes: Object.keys(owners.zoraMetadata.ZORA_THEME_RECIPE_META).sort(),
  };
}

/*** Compose one design without turning missing runtime/UI capabilities into a design blocker. */
export async function composeDesign(input: unknown, targetDirectory = process.cwd()) {
  const owners = await loadOwnerApis(targetDirectory);
  assertRecord(input, 'Design input');
  assertNonEmptyString(input.category, 'category');
  assertRecord(input.navigator, 'navigator');
  const screens = readManifestScreens(input.screens);
  const theme = input.theme === undefined ? {} : input.theme;
  assertRecord(theme, 'theme');
  assertSupportedThemeRecipes(theme.recipes, owners.zoraMetadata.ZORA_THEME_RECIPE_META);

  const regionResult = resolveRegionNodes(
    screens,
    Array.isArray(input.regions) ? input.regions : [],
    owners.zoraMetadata.ZORA_COMPONENT_META,
  );
  const design = owners.templates.compileCategoryDesign(input.category, theme);
  const { computedTheme, ...resolvedDesign } = design;
  const requestedAuthoringState = input.authoringState === 'release' ? 'release' : 'draft';
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
    authoringState: requestedAuthoringState,
  });
  const ownerDiagnostics = [
    ...design.diagnostics,
    ...computedTheme.diagnostics,
    ...composition.diagnostics,
  ];
  const blockers = ownerDiagnostics.filter((diagnostic) => diagnostic.severity === 'error');

  return {
    owners: owners.versions,
    design: resolvedDesign,
    computedTheme,
    composition,
    regionDiagnostics: regionResult.diagnostics,
    capabilityGaps: regionResult.gaps,
    ownerDiagnostics,
    requestedAuthoringState,
    applicationGate: composition.status === 'blocked' ? 'blocked' : 'pass',
    blockers,
  };
}

/*** Resolve explicit region decisions using exact metadata or a visible non-blocking Box placeholder. */
export function resolveRegionNodes(
  screens: Record<string, ManifestScreen | undefined>,
  regions: readonly unknown[],
  componentMeta: Record<string, ComponentMetadata | undefined>,
) {
  const resolvedScreens = structuredClone(screens);
  const diagnostics = [];
  const gaps = [];

  for (const region of regions) {
    assertRecord(region, 'Region');
    assertNonEmptyString(region.id, 'region.id');
    assertNonEmptyString(region.screenId, 'region.screenId');
    assertNonEmptyString(region.requestedCapability, 'region.requestedCapability');
    assertRegion(region);
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

function resolveRegionNode(
  region: Region,
  componentMeta: Record<string, ComponentMetadata | undefined>,
) {
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

  const placeholderMeta = componentMeta.Box;
  if (!placeholderMeta?.directManifestNode) {
    throw new Error('Installed @ankhorage/zora metadata does not expose Box as a manifest node.');
  }
  const reason =
    typeof region.reason === 'string' && region.reason.trim() !== ''
      ? region.reason
      : `No exact metadata-supported ZORA element was selected for region "${region.id}".`;
  const gap = {
    id: `capability-gap:${region.id}`,
    scope: 'capability',
    regionId: region.id,
    requestedCapability: region.requestedCapability,
    evidenceId: region.evidenceId ?? null,
    reason,
  };
  return {
    node: { id: region.id, type: placeholderMeta.name, props: {} },
    diagnostic: {
      status: 'placeholder',
      component: placeholderMeta.name,
      ...gap,
    },
    gap,
  };
}

/*** Validate that manifest props are declared by the selected component metadata. */
function assertSupportedProps(
  props: unknown,
  meta: ComponentMetadata,
  regionId: string,
): Record<string, unknown> {
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
function insertRegionNode(
  screen: ManifestScreen,
  parentNodeId: unknown,
  node: ManifestNode,
  componentMeta: Record<string, ComponentMetadata | undefined>,
): void {
  const parent =
    typeof parentNodeId === 'string' && parentNodeId !== ''
      ? findNode(screen.root, parentNodeId)
      : screen.root;
  if (!parent) {
    throw new Error(`Region parent node not found: ${String(parentNodeId)}`);
  }
  const parentMeta = componentMeta[parent.type];
  if (!parentMeta?.directManifestNode) {
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
function assertSupportedThemeRecipes(
  recipes: unknown,
  recipeMeta: Record<string, RecipeMetadata | undefined>,
): void {
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
      if (meta?.kind !== kind) {
        throw new Error(`Unknown ZORA ${kind} theme recipe: ${recipeName}.`);
      }
      assertRecord(fields, `theme recipe ${recipeName}`);
      for (const [fieldName, value] of Object.entries(fields)) {
        const fieldMeta = meta.fields[fieldName];
        if (fieldMeta === undefined) {
          throw new Error(`Unsupported ZORA theme recipe value: ${recipeName}.${fieldName}.`);
        }
        if (!isRecipeValueSupported(value, fieldMeta)) {
          throw new Error(`Unsupported ZORA theme recipe value: ${recipeName}.${fieldName}.`);
        }
      }
    }
  }
}

/*** Validate one recipe value using its owner-defined boolean, choice, or token field metadata. */
function isRecipeValueSupported(value: unknown, fieldMeta: RecipeFieldMetadata): boolean {
  if (fieldMeta.type === 'boolean') return typeof value === 'boolean';
  if (typeof value !== 'string') return false;
  return fieldMeta.type !== 'choice' || fieldMeta.options?.includes(value) === true;
}

/*** Find a manifest node recursively by stable node ID. */
function findNode(node: ManifestNode, nodeId: string): ManifestNode | null {
  if (node.id === nodeId) return node;
  for (const child of Array.isArray(node.children) ? node.children : []) {
    const found = findNode(child, nodeId);
    if (found) return found;
  }
  return null;
}

/*** Resolve, version-check, and import one public owner module from the target repository. */
async function loadOwnerModule(
  targetDirectory: string,
  requirement: OwnerRequirement,
): Promise<LoadedOwnerModule> {
  let packageManifestPath: string;
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

  const packageManifest: unknown = JSON.parse(await readFile(packageManifestPath, 'utf8'));
  assertRecord(packageManifest, `${requirement.packageName} package manifest`);
  const { version } = packageManifest;
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
  const ownerModule: unknown = await import(pathToFileURL(modulePath).href);
  assertRecord(ownerModule, `${requirement.packageName} public module`);
  const missingExports = requirement.exports.filter((name) => !(name in ownerModule));
  if (missingExports.length > 0) {
    throw ownerError(requirement, `is missing public exports: ${missingExports.join(', ')}`);
  }
  return { module: ownerModule, version };
}

/*** Find the nearest installed package manifest without falling back to the skill's own tree. */
async function findInstalledPackageManifest(
  targetDirectory: string,
  packageName: string,
): Promise<string> {
  const resolvedTarget = resolve(targetDirectory);
  const selfManifestPath = join(resolvedTarget, 'package.json');
  try {
    const selfManifest: unknown = JSON.parse(await readFile(selfManifestPath, 'utf8'));
    assertRecord(selfManifest, 'Target package manifest');
    if (selfManifest.name === packageName) return selfManifestPath;
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
  }

  const filesystemRoot = parse(resolvedTarget).root;
  let directory = resolvedTarget;
  for (;;) {
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
function resolvePublicExportPath(
  packageManifest: Record<string, unknown>,
  packageManifestPath: string,
  specifier: string,
  requirement: OwnerRequirement,
): string {
  const exportKey =
    specifier === requirement.packageName
      ? '.'
      : `./${specifier.slice(requirement.packageName.length + 1)}`;
  const exportsField = packageManifest.exports;
  const rawExport = isRecord(exportsField) ? exportsField[exportKey] : null;
  const exportTarget = selectImportExportTarget(rawExport);
  if (!exportTarget?.startsWith('./')) {
    throw ownerError(requirement, `does not expose the import target for ${specifier}`);
  }
  return resolve(dirname(packageManifestPath), exportTarget);
}

/*** Select the canonical ESM import target without resolving a CommonJS compatibility condition. */
function selectImportExportTarget(rawExport: unknown): string | null {
  if (typeof rawExport === 'string') return rawExport;
  if (!isRecord(rawExport)) return null;
  for (const condition of ['import', 'default', 'bun', 'browser', 'react-native']) {
    if (typeof rawExport[condition] === 'string') return rawExport[condition];
  }
  return null;
}

/*** Create an actionable released-owner diagnostic without offering a compatibility fallback. */
function ownerError(requirement: OwnerRequirement, detail: string, cause?: unknown): Error {
  return new Error(
    `zora-designer requires ${requirement.packageName} >=${requirement.minimumVersion}; ${detail}. ` +
      `Update the target dependency through its normal Renovate/release workflow and rerun inspection.`,
    cause === undefined ? undefined : { cause },
  );
}

/*** Compare stable semantic versions needed by the released public API gates. */
function compareVersions(left: string, right: string): number {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let index = 0; index < 3; index += 1) {
    const difference = leftParts[index] - rightParts[index];
    if (difference !== 0) return difference;
  }
  return 0;
}

/*** Parse the numeric major, minor, and patch tuple from a semantic version. */
function parseVersion(version: string): [number, number, number] {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/u.exec(version);
  if (!match) return [-1, -1, -1];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/*** Read and validate the screen tree boundary supplied by portable JSON input. */
function readManifestScreens(value: unknown): Record<string, ManifestScreen | undefined> {
  assertRecord(value, 'screens');
  const screens: Record<string, ManifestScreen> = {};
  for (const [screenId, screen] of Object.entries(value)) {
    assertRecord(screen, `screen "${screenId}"`);
    assertManifestNode(screen.root, `screen "${screenId}" root`);
    screens[screenId] = { ...screen, root: screen.root };
  }
  return screens;
}

/*** Validate one manifest node recursively before region insertion. */
function assertManifestNode(value: unknown, label: string): asserts value is ManifestNode {
  assertRecord(value, label);
  assertNonEmptyString(value.id, `${label}.id`);
  assertNonEmptyString(value.type, `${label}.type`);
  if (value.props !== undefined) assertRecord(value.props, `${label}.props`);
  if (value.children !== undefined) {
    if (!Array.isArray(value.children)) throw new Error(`${label}.children must be an array.`);
    value.children.forEach((child, index) =>
      assertManifestNode(child, `${label}.children[${index}]`),
    );
  }
}

/*** Finish narrowing a region after its required string fields have been checked. */
function assertRegion(value: Record<string, unknown>): asserts value is Region {
  if (value.props !== undefined) {
    assertRecord(value.props, `props for region "${String(value.id)}"`);
  }
}

/*** Narrow the released Color Theory capability surface used by this script. */
function assertColorTheoryApi(value: Record<string, unknown>): asserts value is ColorTheoryApi {
  assertStringArray(value.COLOR_HARMONIES, 'COLOR_HARMONIES');
  assertRecordArray(value.COLOR_HARMONY_CATALOG, 'COLOR_HARMONY_CATALOG');
}

/*** Narrow the released Contracts capability surface used by this script. */
function assertContractsApi(value: Record<string, unknown>): asserts value is ContractsApi {
  assertStringArray(value.APP_CATEGORIES, 'APP_CATEGORIES');
  assertStringArray(value.NAVIGATOR_TYPES, 'NAVIGATOR_TYPES');
}

/*** Narrow the released Templates capability surface used by this script. */
function assertTemplatesApi(value: Record<string, unknown>): asserts value is TemplatesApi {
  assertRecord(value.CATEGORY_PRESETS, 'CATEGORY_PRESETS');
  assertRecordArray(value.TONE_PAIR_CATALOG, 'TONE_PAIR_CATALOG');
  for (const exportName of [
    'assertTemplateManifestReady',
    'compileCategoryDesign',
    'composeCategoryAppManifest',
    'resolveCategoryDesignPreset',
    'resolveTonePair',
    'validateTemplateManifest',
  ]) {
    if (typeof value[exportName] !== 'function') {
      throw new Error(`${exportName} must be a function.`);
    }
  }
}

/*** Narrow the released ZORA theme compiler capability. */
function assertZoraThemeApi(value: Record<string, unknown>): asserts value is ZoraThemeApi {
  if (typeof value.compileZoraTheme !== 'function') {
    throw new Error('compileZoraTheme must be a function.');
  }
}

/*** Narrow released ZORA metadata into only the fields the orchestration needs. */
function assertZoraMetadataApi(value: Record<string, unknown>): asserts value is ZoraMetadataApi {
  assertRecord(value.ZORA_COMPONENT_META, 'ZORA_COMPONENT_META');
  for (const [name, metadata] of Object.entries(value.ZORA_COMPONENT_META)) {
    assertComponentMetadata(metadata, name);
  }
  assertRecord(value.ZORA_THEME_RECIPE_META, 'ZORA_THEME_RECIPE_META');
  for (const [name, metadata] of Object.entries(value.ZORA_THEME_RECIPE_META)) {
    assertRecipeMetadata(metadata, name);
  }
}

/*** Validate one component metadata entry obtained from the released owner. */
function assertComponentMetadata(value: unknown, name: string): asserts value is ComponentMetadata {
  assertRecord(value, `ZORA component metadata ${name}`);
  assertNonEmptyString(value.name, `ZORA component metadata ${name}.name`);
  if (typeof value.directManifestNode !== 'boolean') {
    throw new Error(`ZORA component metadata ${name}.directManifestNode must be a boolean.`);
  }
  assertStringArray(value.allowedChildren, `ZORA component metadata ${name}.allowedChildren`);
  assertRecord(value.props, `ZORA component metadata ${name}.props`);
  if (value.events !== undefined) {
    assertRecord(value.events, `ZORA component metadata ${name}.events`);
    for (const [eventName, event] of Object.entries(value.events)) {
      assertEventMetadata(event, `${name}.${eventName}`);
    }
  }
  if (value.manifestPolicy !== undefined) {
    assertRecord(value.manifestPolicy, `ZORA component metadata ${name}.manifestPolicy`);
  }
}

/*** Validate one event metadata entry used by interactive discovery. */
function assertEventMetadata(value: unknown, name: string): asserts value is EventMetadata {
  assertRecord(value, `ZORA event metadata ${name}`);
  assertNonEmptyString(value.eventType, `ZORA event metadata ${name}.eventType`);
  assertNonEmptyString(value.label, `ZORA event metadata ${name}.label`);
  assertNonEmptyString(value.description, `ZORA event metadata ${name}.description`);
}

/*** Validate one theme recipe metadata entry and its supported fields. */
function assertRecipeMetadata(value: unknown, name: string): asserts value is RecipeMetadata {
  assertRecord(value, `ZORA theme recipe metadata ${name}`);
  assertNonEmptyString(value.kind, `ZORA theme recipe metadata ${name}.kind`);
  assertRecord(value.fields, `ZORA theme recipe metadata ${name}.fields`);
  for (const [fieldName, field] of Object.entries(value.fields)) {
    assertRecord(field, `ZORA theme recipe field ${name}.${fieldName}`);
    assertNonEmptyString(field.type, `ZORA theme recipe field ${name}.${fieldName}.type`);
    if (field.options !== undefined) {
      assertStringArray(field.options, `ZORA theme recipe field ${name}.${fieldName}.options`);
    }
  }
}

/*** Require an array containing only non-empty strings. */
function assertStringArray(value: unknown, label: string): asserts value is string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  value.forEach((entry, index) => assertNonEmptyString(entry, `${label}[${index}]`));
}

/*** Require an array containing only records. */
function assertRecordArray(
  value: unknown,
  label: string,
): asserts value is Record<string, unknown>[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  value.forEach((entry, index) => assertRecord(entry, `${label}[${index}]`));
}

/*** Require an object-shaped input value. */
function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

/*** Narrow unknown package export metadata to a record. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/*** Require a non-empty string input field. */
function assertNonEmptyString(value: unknown, label: string): asserts value is string {
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
    const input: unknown = JSON.parse(await readFile(inputPath, 'utf8'));
    console.log(JSON.stringify(await composeDesign(input), null, 2));
    return;
  }
  throw new Error('Usage: owner-api.ts inspect | owner-api.ts compose <input.json>');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
