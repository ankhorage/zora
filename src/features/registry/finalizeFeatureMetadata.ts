import { FEATURE_MANIFEST_ELEMENTS, INVERTED_POLARITY_PROP } from '../../constants/authoring';
import type { ZoraComponentMeta, ZoraComponentMetaRegistry } from '../../types/authoring';
import { createManifestBindings } from './createManifestBindings';

/*** Completes feature bindings while preserving each component's explicit value contracts. */
export function finalizeFeatureMetadata(
  registry: ZoraComponentMetaRegistry,
): ZoraComponentMetaRegistry {
  const names: ReadonlySet<string> = new Set(Object.values(FEATURE_MANIFEST_ELEMENTS).flat());
  return Object.fromEntries(
    Object.entries(registry).map(([name, meta]): [string, ZoraComponentMeta] => {
      if (!names.has(name)) return [name, meta];
      const props = { ...meta.props, inverted: INVERTED_POLARITY_PROP };
      const bindings = createManifestBindings(props, meta.events);
      return [
        name,
        {
          ...meta,
          props,
          bindings: {
            props: { ...bindings.props, ...meta.bindings?.props },
            events: { ...bindings.events, ...meta.bindings?.events },
          },
        },
      ];
    }),
  );
}
