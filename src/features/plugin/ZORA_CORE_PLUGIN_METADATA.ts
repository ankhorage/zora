import type { UiComponentMetaRegistry } from '@ankhorage/contracts';

import type { ZoraComponentMetaRegistry } from '../../types/authoring';
import type { ZoraPluginMetadata } from '../../types/plugin';
import { ZORA_BINDABLE_COMPONENT_META } from '../authoring/bindableComponentMeta';
import { ZORA_COMPONENT_META } from '../authoring/componentMeta';

const CORE_EXTENSION_HOSTS = [
  'Card',
  'Grid',
  'MessageBubble',
  'PostCard',
  'Screen',
  'ScreenSection',
  'View',
] as const;

export const ZORA_CORE_PLUGIN_METADATA: ZoraPluginMetadata = {
  packageName: '@ankhorage/zora',
  displayName: 'ZORA',
  componentMeta: mergeBindableMeta(ZORA_COMPONENT_META, ZORA_BINDABLE_COMPONENT_META),
  extensionHosts: CORE_EXTENSION_HOSTS,
};

function mergeBindableMeta(
  componentMeta: ZoraComponentMetaRegistry,
  bindableMeta: UiComponentMetaRegistry,
): ZoraComponentMetaRegistry {
  const bindingsByComponent = new Map(
    Object.entries(bindableMeta).map(([componentName, meta]) => [componentName, meta.bindings]),
  );
  return Object.fromEntries(
    Object.entries(componentMeta).map(([componentName, meta]) => [
      componentName,
      bindingsByComponent.get(componentName)
        ? {
            ...meta,
            bindings: {
              props: { ...bindingsByComponent.get(componentName)?.props, ...meta.bindings?.props },
              events: {
                ...bindingsByComponent.get(componentName)?.events,
                ...meta.bindings?.events,
              },
            },
          }
        : meta,
    ]),
  );
}
