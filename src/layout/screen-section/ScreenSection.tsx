import React from 'react';

import { Stack } from '../../foundation';
import { SectionHeader } from '../../patterns/section-header';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ScreenSectionProps } from './types';

function ScreenSectionInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  actions,
  children,
  testID,
}: ScreenSectionProps) {
  return (
    <Stack gap="m" testID={testID}>
      {title ? <SectionHeader actions={actions} description={description} title={title} /> : null}
      {children}
    </Stack>
  );
}

/***
 * Screen section layout with optional title, description, and actions.
 *
 * @readme
 */
export const ScreenSection = withZoraThemeScope(ScreenSectionInner);
