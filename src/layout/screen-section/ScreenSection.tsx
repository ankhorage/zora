import React from 'react';

import { Grid, Stack } from '../../foundation';
import { SectionHeader } from '../../patterns/section-header';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ScreenSectionProps } from './types';

function hasGridLayout({ columns, minItemWidth }: ScreenSectionProps): boolean {
  return columns !== undefined || minItemWidth !== undefined;
}

function ScreenSectionInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  actions,
  children,
  columns,
  gap = 'm',
  minItemWidth,
  testID,
}: ScreenSectionProps) {
  const content = hasGridLayout({ columns, minItemWidth }) ? (
    <Grid cols={columns ?? { base: 1, md: 2, xl: 3 }} gap={gap} minItemWidth={minItemWidth}>
      {children}
    </Grid>
  ) : (
    children
  );

  return (
    <Stack gap="m" testID={testID}>
      {title ? <SectionHeader actions={actions} description={description} title={title} /> : null}
      {content}
    </Stack>
  );
}

export const ScreenSection = withZoraThemeScope(ScreenSectionInner);
