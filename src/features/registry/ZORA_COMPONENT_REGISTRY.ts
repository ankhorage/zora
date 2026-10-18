import type { ZoraComponentRegistry } from '../../types/registry';
import { Reader } from '../reader/public';
import { createZoraComponentRegistry } from './ZORA_BASE_COMPONENT_REGISTRY';

/*** The complete ZORA runtime component registry, including the public Reader component. */
export const ZORA_COMPONENT_REGISTRY: ZoraComponentRegistry = createZoraComponentRegistry({
  Reader,
});
