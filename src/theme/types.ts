import type {
  ColorContrastContext,
  ColorHarmony,
  ColorSelectionTarget,
  ColorSwatchSelectionResult,
  ColorSwatchTiePolicy,
  GeneratedThemeModeColors,
  GeneratedThemeSwatches,
} from '@ankhorage/color-theory';
import type { AppCategory, ThemeConfig } from '@ankhorage/contracts';
import type { SurfaceTheme } from '@ankhorage/surface/theme';

export type ZoraThemeId = string;

export type ZoraThemeMode = 'light' | 'dark';

export interface ZoraTheme {
  id: ZoraThemeId;
  name: string;
  appCategory: AppCategory;
  primaryColor: string;
  harmony: ColorHarmony;
}

export type ZoraThemeSwatchRole = keyof GeneratedThemeSwatches;

/** A measurable request delegated to Color Theory's canonical swatch selector. */
export interface ZoraThemeSelectionTarget {
  readonly id: string;
  readonly swatch: ZoraThemeSwatchRole;
  readonly target: ColorSelectionTarget;
  readonly contexts: readonly ColorContrastContext[];
  readonly tiePolicy: ColorSwatchTiePolicy;
}

export interface ZoraThemeCompilationOptions {
  readonly selectionTargets?: Partial<Record<ZoraThemeMode, readonly ZoraThemeSelectionTarget[]>>;
}

export interface ZoraThemeSelectionResult {
  readonly request: ZoraThemeSelectionTarget;
  readonly result: ColorSwatchSelectionResult | null;
}

export type ZoraThemeCompilationDiagnosticCode =
  'generated-output-divergence' | 'missing-target-swatch' | 'unresolved-selection-target';

export interface ZoraThemeCompilationDiagnostic {
  readonly code: ZoraThemeCompilationDiagnosticCode;
  readonly message: string;
  readonly mode: ZoraThemeMode;
  readonly path: string;
  readonly severity: 'error';
}

export type ZoraThemeValueOrigin = 'defaulted' | 'derived' | 'direct';

export interface ZoraThemeProvenanceEntry {
  readonly path: string;
  readonly origin: ZoraThemeValueOrigin;
  readonly owner: string;
  readonly inputs?: readonly string[];
}

export interface ZoraComputedThemeMode {
  readonly mode: ZoraThemeMode;
  readonly generated: GeneratedThemeModeColors;
  readonly surfaceTheme: SurfaceTheme;
  readonly selections: readonly ZoraThemeSelectionResult[];
  readonly diagnostics: readonly ZoraThemeCompilationDiagnostic[];
  readonly provenance: readonly ZoraThemeProvenanceEntry[];
}

export interface ZoraComputedTheme {
  readonly themeConfig: ThemeConfig;
  readonly light: ZoraComputedThemeMode;
  readonly dark: ZoraComputedThemeMode;
  readonly diagnostics: readonly ZoraThemeCompilationDiagnostic[];
  readonly provenance: readonly ZoraThemeProvenanceEntry[];
}
