import type { InteractionPolicy } from '@ankhorage/surface';
import { createContext } from 'react';

export const TabsInteractionPolicyContext = createContext<InteractionPolicy>('enabled');
