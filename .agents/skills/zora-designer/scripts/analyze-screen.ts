#!/usr/bin/env bun

import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { loadOwnerApis } from './owner-api.ts';

const DEVTOOLS_PACKAGE_NAME = '@ankhorage/devtools';
const UTILITY_PACKAGE_NAME = '@ankhorage/utility';
const REQUIRED_IMAGE_ENGINES = ['sharp', '@techstark/opencv-js'] as const;

interface ScreenOcr {
  readonly recognizeAsync: (image: Uint8Array) => Promise<readonly unknown[]>;
  readonly terminateAsync?: () => Promise<void>;
}

interface UtilityImageApi {
  readonly analyzeScreenImageAsync: (
    image: string,
    options: Readonly<Record<string, unknown>>,
  ) => Promise<unknown>;
  readonly createTesseractScreenOcrAsync: (options: {
    readonly langPath: string;
    readonly language?: string;
  }) => Promise<ScreenOcr>;
}

interface AnalyzeScreenInput {
  readonly image: string;
  readonly screen: {
    readonly id: string;
    readonly name: string;
    readonly title?: string;
    readonly description?: string;
  };
  readonly minConfidence?: number;
  readonly ocr?: {
    readonly langPath: string;
    readonly language?: string;
  };
}

interface ScreenAnalysisRuntime {
  readonly api: UtilityImageApi;
  readonly utilityVersion: string;
}

/*** Analyze one supplied UI screen with current owner metadata and the released Utility image pipeline. */
export async function analyzeScreenAsync(
  input: unknown,
  targetDirectory = process.cwd(),
): Promise<Record<string, unknown>> {
  const parsedInput = readAnalyzeScreenInput(input);
  const owners = await loadOwnerApis(targetDirectory);
  const components = readComponentCatalog(owners.zoraMetadata.ZORA_COMPONENT_META);
  const unresolvedComponentName = resolveUnresolvedComponentName(components);
  const runtime = await loadScreenAnalysisRuntime(targetDirectory);
  const ocr = await createOptionalOcr(runtime.api, parsedInput.ocr);

  try {
    const analysis = await runtime.api.analyzeScreenImageAsync(
      resolve(targetDirectory, parsedInput.image),
      {
        screen: parsedInput.screen,
        components,
        ...(unresolvedComponentName ? { unresolvedComponentName } : {}),
        ...(parsedInput.minConfidence === undefined
          ? {}
          : { minConfidence: parsedInput.minConfidence }),
        ...(ocr ? { ocr } : {}),
      },
    );
    assertRecord(analysis, 'Utility screen analysis result');
    return {
      owners: { ...owners.versions, utility: runtime.utilityVersion },
      componentCount: components.length,
      componentNames: components.map((component) => String(component.name)).sort(),
      ...(unresolvedComponentName ? { unresolvedComponentName } : {}),
      ...analysis,
    };
  } finally {
    await ocr?.terminateAsync?.();
  }
}

/*** Load Utility image analysis through the installed Devtools dependency boundary. */
async function loadScreenAnalysisRuntime(targetDirectory: string): Promise<ScreenAnalysisRuntime> {
  const devtoolsManifestPath = await resolveDevtoolsManifestPath(targetDirectory);
  const devtoolsRequire = createRequire(devtoolsManifestPath);
  let utilityManifestPath: string;
  try {
    utilityManifestPath = devtoolsRequire.resolve(`${UTILITY_PACKAGE_NAME}/package.json`);
  } catch (error) {
    throw new Error(
      'zora-designer screen analysis requires @ankhorage/utility 0.5.x through the installed @ankhorage/devtools dependency. Update Devtools through the normal release/Renovate workflow and retry.',
      { cause: error },
    );
  }

  assertRequiredImageEngines(devtoolsRequire);
  const utilityManifest: unknown = JSON.parse(await readFile(utilityManifestPath, 'utf8'));
  assertRecord(utilityManifest, '@ankhorage/utility package manifest');
  assertNonEmptyString(utilityManifest.version, '@ankhorage/utility version');

  let modulePath: string;
  try {
    modulePath = devtoolsRequire.resolve(`${UTILITY_PACKAGE_NAME}/image`);
  } catch (error) {
    throw new Error(
      'Installed @ankhorage/utility does not expose the required public /image subpath. Update @ankhorage/devtools so it selects Utility 0.5.x or newer and retry.',
      { cause: error },
    );
  }
  const module: unknown = await import(pathToFileURL(modulePath).href);
  assertUtilityImageApi(module);
  return { api: module, utilityVersion: utilityManifest.version };
}

/*** Resolve the installed Devtools package manifest used as the dependency-resolution anchor. */
async function resolveDevtoolsManifestPath(targetDirectory: string): Promise<string> {
  const targetRoot = resolve(targetDirectory);
  const targetManifestPath = join(targetRoot, 'package.json');
  const targetManifest: unknown = JSON.parse(await readFile(targetManifestPath, 'utf8'));
  assertRecord(targetManifest, 'Target package manifest');
  if (targetManifest.name === DEVTOOLS_PACKAGE_NAME) {
    return targetManifestPath;
  }

  const installedManifestPath = join(
    targetRoot,
    'node_modules',
    '@ankhorage',
    'devtools',
    'package.json',
  );
  try {
    await readFile(installedManifestPath, 'utf8');
    return installedManifestPath;
  } catch (error) {
    throw new Error(
      'zora-designer screen analysis requires the target repository to have @ankhorage/devtools installed. Run the normal Devtools synchronization/install workflow and retry.',
      { cause: error },
    );
  }
}

/*** Require the local deterministic engines used by Utility without making them global Devtools runtime dependencies. */
function assertRequiredImageEngines(devtoolsRequire: ReturnType<typeof createRequire>): void {
  const missing = REQUIRED_IMAGE_ENGINES.filter((packageName) => {
    try {
      devtoolsRequire.resolve(packageName);
      return false;
    } catch {
      return true;
    }
  });
  if (missing.length > 0) {
    throw new Error(
      `zora-designer screen analysis requires local image engines ${missing.join(', ')}. Install the screen-analysis engines in the target repository with "bun add -D sharp @techstark/opencv-js" and retry.`,
    );
  }
}

/*** Create supplementary local OCR while converting setup failures into evidence rather than geometry blockers. */
async function createOptionalOcr(
  api: UtilityImageApi,
  options: AnalyzeScreenInput['ocr'],
): Promise<ScreenOcr | undefined> {
  if (!options) return undefined;
  try {
    return await api.createTesseractScreenOcrAsync(options);
  } catch (error) {
    const rejection = error instanceof Error ? error : new Error(String(error));
    return { recognizeAsync: () => Promise.reject(rejection) };
  }
}

/*** Preserve the full composed owner metadata while validating the fields required by the Utility matcher. */
function readComponentCatalog(value: unknown): Record<string, unknown>[] {
  assertRecord(value, 'Composed ZORA component metadata');
  return Object.values(value)
    .filter((component) => component !== undefined)
    .map((component, index) => {
      assertRecord(component, `ZORA component metadata[${index}]`);
      assertNonEmptyString(component.name, `ZORA component metadata[${index}].name`);
      assertComponentCategory(component.category, `ZORA component metadata[${index}].category`);
      if (typeof component.directManifestNode !== 'boolean') {
        throw new Error(`ZORA component metadata[${index}].directManifestNode must be a boolean.`);
      }
      assertStringArray(
        component.allowedChildren,
        `ZORA component metadata[${index}].allowedChildren`,
      );
      assertRecord(component.props, `ZORA component metadata[${index}].props`);
      return component;
    });
}

/*** Resolve the owner-declared unresolved manifest component without hard-coding a ZORA component name. */
function resolveUnresolvedComponentName(
  components: readonly Record<string, unknown>[],
): string | undefined {
  const unresolved = components.find((component) => {
    const policy = component.manifestPolicy;
    return isRecord(policy) && policy.kind === 'unresolved-element';
  });
  return typeof unresolved?.name === 'string' ? unresolved.name : undefined;
}

/*** Parse and validate portable JSON input for one recognition operation. */
function readAnalyzeScreenInput(value: unknown): AnalyzeScreenInput {
  assertRecord(value, 'Screen analysis input');
  assertNonEmptyString(value.image, 'image');
  assertRecord(value.screen, 'screen');
  assertNonEmptyString(value.screen.id, 'screen.id');
  assertNonEmptyString(value.screen.name, 'screen.name');
  assertOptionalString(value.screen.title, 'screen.title');
  assertOptionalString(value.screen.description, 'screen.description');
  const minConfidence = readMinConfidence(value.minConfidence);
  const ocr = readOcrOptions(value.ocr);

  return {
    image: value.image,
    screen: {
      id: value.screen.id,
      name: value.screen.name,
      ...(value.screen.title === undefined ? {} : { title: value.screen.title }),
      ...(value.screen.description === undefined ? {} : { description: value.screen.description }),
    },
    ...(minConfidence === undefined ? {} : { minConfidence }),
    ...(ocr === undefined ? {} : { ocr }),
  };
}

/*** Read one optional confidence threshold constrained to the Utility matcher interval. */
function readMinConfidence(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error('minConfidence must be a finite number from 0 through 1.');
  }
  return value;
}

/*** Read optional local OCR configuration without making OCR a geometry prerequisite. */
function readOcrOptions(value: unknown): AnalyzeScreenInput['ocr'] {
  if (value === undefined) return undefined;
  assertRecord(value, 'ocr');
  assertNonEmptyString(value.langPath, 'ocr.langPath');
  assertOptionalString(value.language, 'ocr.language');
  return {
    langPath: value.langPath,
    ...(value.language === undefined ? {} : { language: value.language }),
  };
}

/*** Narrow the released Utility image subpath to the two capabilities used by the skill. */
function assertUtilityImageApi(value: unknown): asserts value is UtilityImageApi {
  assertRecord(value, '@ankhorage/utility/image');
  if (typeof value.analyzeScreenImageAsync !== 'function') {
    throw new Error('@ankhorage/utility/image must export analyzeScreenImageAsync.');
  }
  if (typeof value.createTesseractScreenOcrAsync !== 'function') {
    throw new Error('@ankhorage/utility/image must export createTesseractScreenOcrAsync.');
  }
}

/*** Require one current ZORA component category. */
function assertComponentCategory(value: unknown, label: string): void {
  if (!['foundation', 'component', 'pattern', 'layout'].includes(String(value))) {
    throw new Error(`${label} must be a current ZORA component category.`);
  }
}

/*** Require an array containing only strings. */
function assertStringArray(value: unknown, label: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`${label} must be a string array.`);
  }
}

/*** Require an optional non-empty string when present. */
function assertOptionalString(value: unknown, label: string): asserts value is string | undefined {
  if (value !== undefined) assertNonEmptyString(value, label);
}

/*** Require an object-shaped value. */
function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${label} must be an object.`);
}

/*** Narrow an unknown value to a record. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/*** Require a non-empty string. */
function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

/*** Run the portable recognition command when executed directly. */
async function main(): Promise<void> {
  const [inputPath] = process.argv.slice(2);
  if (!inputPath) {
    throw new Error('Usage: analyze-screen.ts <screen-analysis-input.json>');
  }
  const input: unknown = JSON.parse(await readFile(inputPath, 'utf8'));
  console.log(JSON.stringify(await analyzeScreenAsync(input), null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
