import React from 'react';

import { Stack } from '../../foundation';
import { SectionHeader } from '../../patterns/section-header';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { PageSectionProps } from './types';

function PageSectionInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  actions,
  children,
  testID,
}: PageSectionProps) {
  return (
    <Stack gap="m" testID={testID}>
      {title ? <SectionHeader actions={actions} description={description} title={title} /> : null}
      {children}
    </Stack>
  );
}

export const PageSection = withZoraThemeScope(PageSectionInner);
