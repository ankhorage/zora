import type { UiComponentMetaRegistry, UiComponentPackageManifest } from '@ankhorage/contracts';

import type { ZoraComponentMeta, ZoraComponentMetaRegistry } from './metadata/types';
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

/*** Report one deterministic plugin composition contract violation. */
export class ZoraPluginCompositionError extends Error {
  readonly code: ZoraPluginCompositionErrorCode;
  readonly packageName: string;
  readonly componentName?: string;

  constructor(args: {
    readonly code: ZoraPluginCompositionErrorCode;
    readonly packageName: string;
    readonly message: string;
    readonly componentName?: string;
  }) {
    super(args.message);
    this.name = 'ZoraPluginCompositionError';
    this.code = args.code;
    this.packageName = args.packageName;
    this.componentName = args.componentName;
  }
}

/*** Compose a selected ZORA metadata set for authoring tools that must not load React Native runtime modules. */
export function composeZoraPluginMetadata(
  plugins: readonly ZoraPluginMetadata[],
): ComposedZoraPluginMetadataCatalog {
  const descriptors = sortPlugins(plugins);
  const packages = new Set<string>();
  const componentOwners = new Map<string, string>();
  const componentMeta = new Map<string, ZoraComponentMeta>();
  const extensionHosts = new Set<string>();
  const interactionPolicySupportedComponents = new Set<string>();

  for (const descriptor of descriptors) {
    validateUniquePackage(descriptor, packages);
    validateMetadata(descriptor);
    for (const [componentName, meta] of sortedEntries(descriptor.componentMeta)) {
      claimComponent(componentName, descriptor.packageName, componentOwners);
      componentMeta.set(componentName, meta);
    }
    for (const componentName of descriptor.extensionHosts ?? []) extensionHosts.add(componentName);
    for (const componentName of descriptor.interactionPolicySupportedComponents ?? []) {
      interactionPolicySupportedComponents.add(componentName);
    }
  }

  for (const descriptor of descriptors) {
    for (const placement of descriptor.placements ?? []) {
      applyPlacement({ descriptor, placement, componentMeta, extensionHosts });
    }
  }

  return {
    componentMeta: Object.fromEntries(componentMeta),
    bindableComponentMeta: Object.fromEntries(componentMeta),
    packageManifests: descriptors.map(({ packageName, displayName, componentMeta }) => ({
      packageName,
      ...(displayName === undefined ? {} : { displayName }),
      components: componentMeta,
    })),
    interactionPolicySupportedComponents: Object.fromEntries(
      [...interactionPolicySupportedComponents]
        .sort()
        .map((componentName) => [componentName, true]),
    ),
  };
}

/*** Compose a selected ZORA core/plugin descriptor set into one validated authoring/runtime catalog. */
export function composeZoraPlugins(
  plugins: readonly ZoraPluginDescriptor[],
): ComposedZoraPluginCatalog {
  const descriptors = sortPlugins(plugins);
  const componentRegistry = new Map<string, ZoraComponentRegistry[string]>();

  for (const descriptor of descriptors) {
    validateRuntime(descriptor);
    for (const [componentName, component] of sortedEntries(descriptor.componentRegistry)) {
      componentRegistry.set(componentName, component);
    }
  }
  const metadataCatalog = composeZoraPluginMetadata(descriptors);

  return { ...metadataCatalog, componentRegistry: Object.fromEntries(componentRegistry) };
}

function validateUniquePackage(descriptor: ZoraPluginMetadata, packages: Set<string>): void {
  if (packages.has(descriptor.packageName)) {
    throw compositionError(
      'duplicate-package',
      descriptor.packageName,
      `Duplicate ZORA plugin package '${descriptor.packageName}'.`,
    );
  }
  packages.add(descriptor.packageName);
}

function validateMetadata(descriptor: ZoraPluginMetadata): void {
  for (const [componentName, meta] of sortedEntries(descriptor.componentMeta)) {
    if (meta.name !== componentName) {
      throw compositionError(
        'invalid-component-meta',
        descriptor.packageName,
        `ZORA plugin '${descriptor.packageName}' metadata key '${componentName}' does not match meta.name '${meta.name}'.`,
        componentName,
      );
    }
  }
}

function validateRuntime(descriptor: ZoraPluginDescriptor): void {
  const componentMetaNames = new Set(Object.keys(descriptor.componentMeta));
  const runtimeComponentNames = new Set(Object.keys(descriptor.componentRegistry));
  for (const componentName of sortedKeys(descriptor.componentRegistry)) {
    if (!componentMetaNames.has(componentName)) {
      throw compositionError(
        'missing-component-meta',
        descriptor.packageName,
        `ZORA plugin '${descriptor.packageName}' registers runtime component '${componentName}' without component metadata.`,
        componentName,
      );
    }
  }
  for (const [componentName, meta] of sortedEntries(descriptor.componentMeta)) {
    if (meta.directManifestNode && !runtimeComponentNames.has(componentName)) {
      throw compositionError(
        'missing-runtime-component',
        descriptor.packageName,
        `ZORA plugin '${descriptor.packageName}' exposes direct manifest node '${componentName}' without a runtime component.`,
        componentName,
      );
    }
  }
  for (const componentName of descriptor.interactionPolicySupportedComponents ?? []) {
    if (!runtimeComponentNames.has(componentName)) {
      throw compositionError(
        'invalid-interaction-policy-component',
        descriptor.packageName,
        `ZORA plugin '${descriptor.packageName}' declares interaction-policy support for unregistered component '${componentName}'.`,
        componentName,
      );
    }
  }
}

function claimComponent(
  componentName: string,
  packageName: string,
  owners: Map<string, string>,
): void {
  const existingOwner = owners.get(componentName);
  if (existingOwner) {
    throw compositionError(
      'duplicate-component',
      packageName,
      `ZORA component '${componentName}' is owned by both '${existingOwner}' and '${packageName}'.`,
      componentName,
    );
  }
  owners.set(componentName, packageName);
}

function applyPlacement(args: {
  descriptor: ZoraPluginMetadata;
  placement: ZoraPluginPlacement;
  componentMeta: Map<string, ZoraComponentMeta>;
  extensionHosts: ReadonlySet<string>;
}): void {
  const { descriptor, placement, componentMeta, extensionHosts } = args;
  const childMeta = descriptor.componentMeta[placement.child];
  if (!childMeta?.directManifestNode) {
    throw compositionError(
      'invalid-placement-child',
      descriptor.packageName,
      `ZORA plugin '${descriptor.packageName}' placement child '${placement.child}' is not an owned direct manifest node.`,
      placement.child,
    );
  }
  for (const parentName of [...placement.parents].sort()) {
    const parentMeta = componentMeta.get(parentName);
    if (!parentMeta || !extensionHosts.has(parentName)) {
      throw compositionError(
        'invalid-placement-parent',
        descriptor.packageName,
        `ZORA plugin '${descriptor.packageName}' placement parent '${parentName}' is not a declared extension host.`,
        placement.child,
      );
    }
    componentMeta.set(parentName, addAllowedChild(parentMeta, placement.child));
  }
}

function addAllowedChild(meta: ZoraComponentMeta, child: string): ZoraComponentMeta {
  const allowedChildren = appendUnique(meta.allowedChildren, child);
  const childrenSlot = meta.slots?.children;
  return {
    ...meta,
    allowedChildren,
    ...(childrenSlot
      ? {
          slots: {
            ...meta.slots,
            children: {
              ...childrenSlot,
              allowedChildren: appendUnique(childrenSlot.allowedChildren ?? [], child),
            },
          },
        }
      : {}),
  };
}

function appendUnique(values: readonly string[], value: string): readonly string[] {
  return values.includes(value) ? values : [...values, value];
}

function sortedKeys(value: Readonly<Record<string, unknown>>): string[] {
  return Object.keys(value).sort();
}

function sortedEntries<T>(value: Readonly<Record<string, T>>): [string, T][] {
  return Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
}

function sortPlugins<T extends ZoraPluginMetadata>(plugins: readonly T[]): T[] {
  return [...plugins].sort((left, right) => left.packageName.localeCompare(right.packageName));
}

function compositionError(
  code: ZoraPluginCompositionErrorCode,
  packageName: string,
  message: string,
  componentName?: string,
): ZoraPluginCompositionError {
  return new ZoraPluginCompositionError({ code, packageName, message, componentName });
}
