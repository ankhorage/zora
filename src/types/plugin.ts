import type { UiComponentMetaRegistry, UiComponentPackageManifest } from '@ankhorage/contracts';

import type { ZoraComponentMetaRegistry } from './authoring';
import type { ZoraComponentRegistry } from './registry';

export type ZoraPluginCompositionErrorCode =
  | 'duplicate-component'
  | 'duplicate-package'
  | 'invalid-component-meta'
  | 'invalid-interaction-policy-component'
  | 'invalid-placement-child'
  | 'invalid-placement-parent'
  | 'missing-component-meta'
  | 'missing-runtime-component';

export interface ZoraPluginPlacement {
  readonly child: string;
  readonly parents: readonly string[];
}

export interface ZoraPluginMetadata {
  readonly packageName: string;
  readonly displayName?: string;
  readonly componentMeta: ZoraComponentMetaRegistry;
  readonly extensionHosts?: readonly string[];
  readonly placements?: readonly ZoraPluginPlacement[];
  readonly interactionPolicySupportedComponents?: readonly string[];
}

export interface ZoraPluginDescriptor extends ZoraPluginMetadata {
  readonly componentRegistry: ZoraComponentRegistry;
}

export interface ComposedZoraPluginMetadataCatalog {
  readonly componentMeta: ZoraComponentMetaRegistry;
  readonly bindableComponentMeta: UiComponentMetaRegistry;
  readonly packageManifests: readonly UiComponentPackageManifest[];
  readonly interactionPolicySupportedComponents: Readonly<Record<string, true>>;
}

export interface ComposedZoraPluginCatalog extends ComposedZoraPluginMetadataCatalog {
  readonly componentRegistry: ZoraComponentRegistry;
}
