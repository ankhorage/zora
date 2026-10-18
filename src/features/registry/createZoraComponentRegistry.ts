import type { ZoraComponentRegistry } from '../../types/registry';
import { ZORA_BASE_COMPONENT_REGISTRY } from './ZORA_BASE_COMPONENT_REGISTRY';

/*** Build a runtime component registry from ZORA's Reader-free base and explicitly selected feature entries. */
export function createZoraComponentRegistry(
  extensions: ZoraComponentRegistry = {},
): ZoraComponentRegistry {
  return { ...ZORA_BASE_COMPONENT_REGISTRY, ...extensions };
}
