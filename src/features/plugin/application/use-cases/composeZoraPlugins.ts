import type {
  ComposedZoraPluginCatalog,
  ZoraPluginCompositionErrorCode,
  ZoraPluginDescriptor,
} from '../../../../types/plugin';
import type { ZoraComponentRegistry } from '../../../../types/registry';
import { ZoraPluginCompositionError } from '../../domain/ZoraPluginCompositionError';
import { composeZoraPluginMetadata } from './composeZoraPluginMetadata';

/*** Compose a selected ZORA core/plugin descriptor set into one validated authoring/runtime catalog. */
export function composeZoraPlugins(
  plugins: readonly ZoraPluginDescriptor[],
): ComposedZoraPluginCatalog {
  const descriptors = [...plugins].sort((left, right) =>
    left.packageName.localeCompare(right.packageName),
  );
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

function validateRuntime(descriptor: ZoraPluginDescriptor): void {
  const componentMetaNames = new Set(Object.keys(descriptor.componentMeta));
  const runtimeComponentNames = new Set(Object.keys(descriptor.componentRegistry));
  for (const componentName of Object.keys(descriptor.componentRegistry).sort()) {
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

function sortedEntries<T>(value: Readonly<Record<string, T>>): [string, T][] {
  return Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
}

function compositionError(
  code: ZoraPluginCompositionErrorCode,
  packageName: string,
  message: string,
  componentName?: string,
): ZoraPluginCompositionError {
  return new ZoraPluginCompositionError({ code, packageName, message, componentName });
}
