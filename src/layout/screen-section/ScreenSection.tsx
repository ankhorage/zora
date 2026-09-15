import React from 'react';

import { View } from '../../features/layout/public';
import { SectionHeader } from '../../patterns/section-header';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ScreenSectionProps } from './types';

function ScreenSectionInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  title,
  description,
  actions,
  children,
  testID,
}: ScreenSectionProps) {
  return (
    <View gap="m" testID={testID}>
      {title ? <SectionHeader actions={actions} description={description} title={title} /> : null}
      {children}
    </View>
  );
}

/***
 * Screen section layout with optional title, description, and actions.
 *
 
 */
export const ScreenSection = withZoraThemeScope(ScreenSectionInner);
