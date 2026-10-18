import type { ZoraComponentRegistry } from '../../types/registry';
import { Reader } from '../reader/public';
import { createZoraComponentRegistry } from './createZoraComponentRegistry';

/*** The complete ZORA runtime component registry, including the public Reader component. */
export const ZORA_COMPONENT_REGISTRY: ZoraComponentRegistry = createZoraComponentRegistry({
  Reader,
});
