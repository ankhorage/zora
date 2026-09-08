import { ZORA_CORE_PLUGIN_METADATA } from './corePluginMetadata';
import type { ZoraPluginDescriptor } from './pluginComposition';
import { ZORA_COMPONENT_REGISTRY } from './registry';

/*** Describe the complete ZORA core runtime and authoring surface through the public plugin contract. */
export const ZORA_CORE_PLUGIN: ZoraPluginDescriptor = {
  ...ZORA_CORE_PLUGIN_METADATA,
  componentRegistry: ZORA_COMPONENT_REGISTRY,
};
