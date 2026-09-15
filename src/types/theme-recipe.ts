export type ZoraThemeTokenFamily = 'colors' | 'spacing' | 'radii' | 'typography' | 'shadows';

export type ZoraThemeRecipeKind = 'component' | 'pattern';

interface ZoraThemeRecipeFieldBase {
  readonly label: string;
  readonly description?: string;
}

export interface ZoraThemeRecipeTokenFieldMeta extends ZoraThemeRecipeFieldBase {
  readonly type: 'token';
  readonly tokenFamily: ZoraThemeTokenFamily;
  readonly default?: string;
}

export interface ZoraThemeRecipeChoiceFieldMeta extends ZoraThemeRecipeFieldBase {
  readonly type: 'choice';
  readonly options: readonly string[];
  readonly default?: string;
}

export interface ZoraThemeRecipeBooleanFieldMeta extends ZoraThemeRecipeFieldBase {
  readonly type: 'boolean';
  readonly default?: boolean;
}

export type ZoraThemeRecipeFieldMeta =
  ZoraThemeRecipeTokenFieldMeta | ZoraThemeRecipeChoiceFieldMeta | ZoraThemeRecipeBooleanFieldMeta;

export interface ZoraThemeRecipeMeta {
  readonly name: string;
  readonly kind: ZoraThemeRecipeKind;
  readonly description?: string;
  readonly fields: Readonly<Record<string, ZoraThemeRecipeFieldMeta>>;
}

export type ZoraThemeRecipeMetaRegistry = Readonly<Record<string, ZoraThemeRecipeMeta>>;
