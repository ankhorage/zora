import React from 'react';

import { SectionHeader } from '../../../../patterns/section-header';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ScreenSectionProps } from '../../../../types/layout';
import { View } from './View';

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

/*** Screen section with optional heading, description, actions, and content. */
export const ScreenSection = withZoraThemeScope(ScreenSectionInner);
