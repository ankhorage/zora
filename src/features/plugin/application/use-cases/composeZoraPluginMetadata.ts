import type { ZoraComponentMeta } from '../../../../types/authoring';
import type {
  ComposedZoraPluginMetadataCatalog,
  ZoraPluginCompositionErrorCode,
  ZoraPluginMetadata,
  ZoraPluginPlacement,
} from '../../../../types/plugin';
import { ZoraPluginCompositionError } from '../../domain/ZoraPluginCompositionError';

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
    packageManifests: descriptors.map(({ packageName, displayName, componentMeta: meta }) => ({
      packageName,
      ...(displayName === undefined ? {} : { displayName }),
      components: meta,
    })),
    interactionPolicySupportedComponents: Object.fromEntries(
      [...interactionPolicySupportedComponents]
        .sort()
        .map((componentName) => [componentName, true]),
    ),
  };
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
