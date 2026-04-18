import { Stack } from '@ankhorage/surface';
import React from 'react';

import { SectionHeader } from '../../patterns/section-header';
import type { PageSectionProps } from './types';

export function PageSection({ title, description, actions, children, testID }: PageSectionProps) {
  return (
    <Stack gap="m" testID={testID}>
      {title ? <SectionHeader actions={actions} description={description} title={title} /> : null}
      {children}
    </Stack>
  );
}
