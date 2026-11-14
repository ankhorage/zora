import type React from 'react';

import type {
  ZoraComponentMeta,
  ZoraComponentPropSchema,
  ZoraComponentPropValue,
} from './authoring';
import type { ZoraThemeRecipeFieldMeta, ZoraThemeRecipeMetaRegistry } from './theme-recipe';

export interface AuthoringSelectionItemState<TItem> {
  readonly item: TItem;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly select: () => void;
}

export interface AuthoringSelectionAdapterProps<TItem> {
  readonly items: readonly TItem[];
  readonly selectedItemId?: string;
  readonly getItemId: (item: TItem) => string;
  readonly onSelectionChange?: (item: TItem | null) => void;
  readonly renderItem: (state: AuthoringSelectionItemState<TItem>) => React.ReactNode;
  readonly disabled?: boolean;
}

export interface AuthoringPropertyControlState<TNode> {
  readonly node: TNode;
  readonly component: ZoraComponentMeta;
  readonly name: string;
  readonly schema: ZoraComponentPropSchema;
  readonly value: ZoraComponentPropValue | undefined;
  readonly disabled: boolean;
  readonly required: boolean;
  readonly onChange: (value: ZoraComponentPropValue | undefined) => void;
}

export interface AuthoringPropertyInspectorAdapterProps<TNode> {
  readonly node: TNode | null;
  readonly component: ZoraComponentMeta | null;
  readonly getPropertyValue: (node: TNode, name: string) => ZoraComponentPropValue | undefined;
  readonly onPropertyChange?: (
    node: TNode,
    name: string,
    value: ZoraComponentPropValue | undefined,
  ) => void;
  readonly renderProperty: (state: AuthoringPropertyControlState<TNode>) => React.ReactNode;
  readonly isPropertyDisabled?: (
    node: TNode,
    name: string,
    schema: ZoraComponentPropSchema,
  ) => boolean;
  readonly isPropertyRequired?: (
    node: TNode,
    name: string,
    schema: ZoraComponentPropSchema,
  ) => boolean;
  readonly disabled?: boolean;
}

export interface AuthoringBindingControlState<TNode, TBinding> {
  readonly node: TNode;
  readonly component: ZoraComponentMeta;
  readonly name: string;
  readonly label: string;
  readonly description?: string;
  readonly binding: TBinding | undefined;
  readonly disabled: boolean;
  readonly required: boolean;
  readonly onChange: (binding: TBinding | undefined) => void;
}

export interface AuthoringBindingEditorAdapterProps<TNode, TBinding> {
  readonly node: TNode | null;
  readonly component: ZoraComponentMeta | null;
  readonly getBinding: (node: TNode, name: string) => TBinding | undefined;
  readonly onBindingChange?: (node: TNode, name: string, binding: TBinding | undefined) => void;
  readonly renderBinding: (state: AuthoringBindingControlState<TNode, TBinding>) => React.ReactNode;
  readonly isBindingDisabled?: (node: TNode, name: string) => boolean;
  readonly isBindingRequired?: (node: TNode, name: string) => boolean;
  readonly disabled?: boolean;
}

export interface ThemeRecipeFieldControlState<TTheme> {
  readonly theme: TTheme;
  readonly recipeName: string;
  readonly fieldName: string;
  readonly field: ZoraThemeRecipeFieldMeta;
  readonly value: string | boolean | undefined;
  readonly disabled: boolean;
  readonly required: boolean;
  readonly onChange: (value: string | boolean | undefined) => void;
}

export interface ThemeEditorAdapterProps<TTheme> {
  readonly theme: TTheme | null;
  readonly recipes?: ZoraThemeRecipeMetaRegistry;
  readonly getRecipeFieldValue: (
    theme: TTheme,
    recipeName: string,
    fieldName: string,
  ) => string | boolean | undefined;
  readonly onRecipeFieldChange?: (
    theme: TTheme,
    recipeName: string,
    fieldName: string,
    value: string | boolean | undefined,
  ) => void;
  readonly renderField: (state: ThemeRecipeFieldControlState<TTheme>) => React.ReactNode;
  readonly isFieldDisabled?: (theme: TTheme, recipeName: string, fieldName: string) => boolean;
  readonly isFieldRequired?: (theme: TTheme, recipeName: string, fieldName: string) => boolean;
  readonly disabled?: boolean;
}
