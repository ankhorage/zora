import { FEATURE_MANIFEST_ELEMENTS } from '../constants';
import type { ZoraComponentMetaRegistry } from '../metadata/types';
import { createManifestBindings } from './createManifestBindings';

/*** Completes feature bindings while preserving each component's explicit value contracts. */
export function finalizeFeatureMetadata(
  registry: ZoraComponentMetaRegistry,
): ZoraComponentMetaRegistry {
  const names: ReadonlySet<string> = new Set(Object.values(FEATURE_MANIFEST_ELEMENTS).flat());
  return Object.fromEntries(
    Object.entries(registry).map(([name, meta]) => {
      if (!names.has(name)) return [name, meta];
      const bindings = createManifestBindings(meta.props, meta.events);
      return [
        name,
        {
          ...meta,
          bindings: {
            props: { ...bindings.props, ...meta.bindings?.props },
            events: { ...bindings.events, ...meta.bindings?.events },
          },
        },
      ];
    }),
  );
}
