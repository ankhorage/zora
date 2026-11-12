import type { Capability } from '@ankhorage/contracts/capability';

import { createEventCapabilities } from '../features/registry/createEventCapabilities.js';

export const CAPABILITIES = [...createEventCapabilities()] satisfies readonly Capability[];
