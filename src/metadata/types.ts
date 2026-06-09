import type { ComponentEventDtoKind, ComponentRequirements } from '@ankhorage/contracts';

export type ZoraComponentCategory = 'foundation' | 'component' | 'pattern' | 'layout';

export type ZoraComponentPropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'color'
  | 'spacing'
  | 'radius'
  | 'shadow'
  | 'typographySize'
  | 'typographyWeight'
  | 'action'
  | 'imageAsset'
  | 'array';

export type ZoraComponentPropValue =
  | string
  | number
  | boolean
  | null
  | readonly ZoraComponentPropValue[]
  | { readonly [key: string]: ZoraComponentPropValue };

export interface ZoraComponentPropArrayItemSchema {
  key: string;
  schema: ZoraComponentPropSchema;
}

export interface ZoraComponentPropSchema {
  type: ZoraComponentPropType;
  category: string;
  label?: string;
  enum?: readonly (string | number)[];
  default?: ZoraComponentPropValue;
  itemSchema?: readonly ZoraComponentPropArrayItemSchema[];
}

export interface ZoraComponentBlueprint {
  label: string;
  icon?: {
    name: string;
    provider?: string;
  };
  defaultProps?: Readonly<Record<string, ZoraComponentPropValue>>;
}

export interface ZoraComponentI18nMeta {
  fields: readonly {
    keyProp: string;
    defaultTextProp: string;
  }[];
}

export type ZoraComponentEventPayloadKind = ComponentEventDtoKind | (string & {});

export type ZoraComponentEventPayloadFieldType =
  | 'boolean'
  | 'number'
  | 'object'
  | 'record'
  | 'string'
  | 'unknown';

export interface ZoraComponentEventPayloadFieldMeta {
  readonly path: string;
  readonly type: ZoraComponentEventPayloadFieldType;
  readonly label?: string;
  readonly description?: string;
}

export interface ZoraComponentEventMeta {
  readonly label: string;
  readonly eventType: ZoraComponentEventPayloadKind;
  readonly description?: string;
  readonly payloadFields?: readonly ZoraComponentEventPayloadFieldMeta[];
}

export interface ZoraComponentSlotMeta {
  label?: string;
  allowedChildren?: readonly string[];
}

export interface ZoraComponentMeta {
  name: string;
  category: ZoraComponentCategory;
  description?: string;
  directManifestNode: boolean;
  allowedChildren: readonly string[];
  requirements?: ComponentRequirements;
  blueprint?: ZoraComponentBlueprint;
  events?: Readonly<Record<string, ZoraComponentEventMeta>>;
  i18n?: ZoraComponentI18nMeta;
  slots?: Readonly<Record<string, ZoraComponentSlotMeta>>;
  note?: string;
  props: Readonly<Record<string, ZoraComponentPropSchema>>;
}

export type ZoraComponentMetaRegistry = Readonly<Record<string, ZoraComponentMeta>>;
