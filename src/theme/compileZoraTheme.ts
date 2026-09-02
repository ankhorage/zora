import { generateThemeModeColors, selectColorSwatchStep } from '@ankhorage/color-theory';
import type { ThemeConfig } from '@ankhorage/contracts';
import { createTheme } from '@ankhorage/surface/theme';

import type {
  ZoraComputedTheme,
  ZoraComputedThemeMode,
  ZoraThemeCompilationDiagnostic,
  ZoraThemeCompilationOptions,
  ZoraThemeMode,
  ZoraThemeProvenanceEntry,
  ZoraThemeSelectionResult,
  ZoraThemeSelectionTarget,
} from './types';

const CONTRACTS_OWNER = '@ankhorage/contracts';
const COLOR_THEORY_OWNER = '@ankhorage/color-theory';
const SURFACE_OWNER = '@ankhorage/surface';
const ZORA_OWNER = '@ankhorage/zora';

/***
 * Compile canonical theme source into Color Theory evidence and resolved Surface themes.
 * This function is pure and does not mount React or reproduce owner algorithms.
 */
export function compileZoraTheme(
  themeConfig: ThemeConfig,
  options: ZoraThemeCompilationOptions = {},
): ZoraComputedTheme {
  const light = compileMode(themeConfig, 'light', options.selectionTargets?.light ?? []);
  const dark = compileMode(themeConfig, 'dark', options.selectionTargets?.dark ?? []);
  const diagnostics = [...light.diagnostics, ...dark.diagnostics];

  return {
    themeConfig,
    light,
    dark,
    diagnostics,
    provenance: createRootProvenance(themeConfig),
  };
}

/*** Compile one canonical mode and compare the independent owner results. */
function compileMode(
  themeConfig: ThemeConfig,
  mode: ZoraThemeMode,
  targets: readonly ZoraThemeSelectionTarget[],
): ZoraComputedThemeMode {
  const modeConfig = mode === 'light' ? themeConfig.light : themeConfig.dark;
  const generated = generateThemeModeColors(modeConfig);
  const surfaceTheme = createTheme(themeConfig, mode);
  const { diagnostics, selections } = resolveSelections(generated, mode, targets);

  if (!outputsAgree(generated, surfaceTheme.colorDiagnostics.generated)) {
    diagnostics.push({
      code: 'generated-output-divergence',
      message: 'Surface and Color Theory returned different generated color evidence.',
      mode,
      path: `${mode}.generated`,
      severity: 'error',
    });
  }

  return {
    mode,
    generated,
    surfaceTheme,
    selections,
    diagnostics,
    provenance: createModeProvenance(mode, targets),
  };
}

/*** Resolve measurable swatch targets without substituting unavailable roles. */
function resolveSelections(
  generated: ZoraComputedThemeMode['generated'],
  mode: ZoraThemeMode,
  targets: readonly ZoraThemeSelectionTarget[],
): {
  diagnostics: ZoraThemeCompilationDiagnostic[];
  selections: ZoraThemeSelectionResult[];
} {
  const diagnostics: ZoraThemeCompilationDiagnostic[] = [];
  const selections = targets.map((request) => {
    const swatch = generated.swatches[request.swatch];
    const result = swatch
      ? selectColorSwatchStep(swatch, request.target, request.contexts, request.tiePolicy)
      : null;

    if (!swatch) diagnostics.push(createMissingSwatchDiagnostic(mode, request));
    else if (!result?.selected) diagnostics.push(createUnresolvedTargetDiagnostic(mode, request));

    return { request, result };
  });

  return { diagnostics, selections };
}

/*** Describe a requested swatch that the selected harmony does not generate. */
function createMissingSwatchDiagnostic(
  mode: ZoraThemeMode,
  request: ZoraThemeSelectionTarget,
): ZoraThemeCompilationDiagnostic {
  return {
    code: 'missing-target-swatch',
    message: `The selected harmony does not generate the '${request.swatch}' swatch.`,
    mode,
    path: `${mode}.selectionTargets.${request.id}`,
    severity: 'error',
  };
}

/*** Describe a measurable target that has no passing swatch candidate. */
function createUnresolvedTargetDiagnostic(
  mode: ZoraThemeMode,
  request: ZoraThemeSelectionTarget,
): ZoraThemeCompilationDiagnostic {
  return {
    code: 'unresolved-selection-target',
    message: `No '${request.swatch}' step satisfies selection target '${request.id}'.`,
    mode,
    path: `${mode}.selectionTargets.${request.id}`,
    severity: 'error',
  };
}

/*** Record direct source and Surface-owned default provenance. */
function createRootProvenance(themeConfig: ThemeConfig): ZoraThemeProvenanceEntry[] {
  return [
    { path: 'themeConfig', origin: 'direct', owner: CONTRACTS_OWNER },
    {
      path: 'themeConfig.tokens',
      origin: themeConfig.tokens ? 'direct' : 'defaulted',
      owner: themeConfig.tokens ? CONTRACTS_OWNER : SURFACE_OWNER,
    },
  ];
}

/*** Record the owner transformation chain for one compiled mode. */
function createModeProvenance(
  mode: ZoraThemeMode,
  targets: readonly ZoraThemeSelectionTarget[],
): ZoraThemeProvenanceEntry[] {
  const inputPath = `themeConfig.${mode}`;
  const entries: ZoraThemeProvenanceEntry[] = [
    { path: inputPath, origin: 'direct', owner: CONTRACTS_OWNER },
    {
      path: `${mode}.generated`,
      origin: 'derived',
      owner: COLOR_THEORY_OWNER,
      inputs: [inputPath],
    },
    {
      path: `${mode}.surfaceTheme`,
      origin: 'derived',
      owner: SURFACE_OWNER,
      inputs: ['themeConfig', inputPath],
    },
  ];

  for (const target of targets) {
    const targetPath = `${mode}.selectionTargets.${target.id}`;
    entries.push({ path: targetPath, origin: 'direct', owner: ZORA_OWNER });
    entries.push({
      path: `${mode}.selections.${target.id}`,
      origin: 'derived',
      owner: COLOR_THEORY_OWNER,
      inputs: [`${mode}.generated.swatches.${target.swatch}`, targetPath],
    });
  }

  return entries;
}

/*** Compare deterministic owner result records for divergence diagnostics. */
function outputsAgree(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
