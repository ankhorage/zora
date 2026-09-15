import type { ZoraPluginDescriptor } from '../../types/plugin';
import { ZORA_COMPONENT_REGISTRY } from '../registry/ZORA_COMPONENT_REGISTRY';
import { ZORA_CORE_PLUGIN_METADATA } from './ZORA_CORE_PLUGIN_METADATA';

/*** Describe the complete ZORA core runtime and authoring surface through the public plugin contract. */
export const ZORA_CORE_PLUGIN: ZoraPluginDescriptor = {
  ...ZORA_CORE_PLUGIN_METADATA,
  componentRegistry: ZORA_COMPONENT_REGISTRY,
};
