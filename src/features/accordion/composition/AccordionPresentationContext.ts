import React from 'react';

import type { AccordionPresentationContextValue } from '../../../types/accordion';

export const AccordionPresentationContext =
  React.createContext<AccordionPresentationContextValue | null>(null);
