import React from 'react';

import { Badge } from '../../features/badge/public';
import { Card } from '../../features/card/public';
import { View } from '../../features/layout/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { NoticeProps } from './types';

function NoticeInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  title,
  description,
  children,
  actions,
  color = 'primary',
  testID,
}: NoticeProps) {
  return (
    <Card
      description={description}
      eyebrow={<Badge color={color}>{String(color).toUpperCase()}</Badge>}
      testID={testID}
      title={title}
      tone="subtle"
    >
      <View gap="m">
        {children ? <View>{children}</View> : null}
        {actions ? <View>{actions}</View> : null}
      </View>
    </Card>
  );
}

/***
 * Notice pattern for inline feedback with tone, title, and actions.
 *
 
 */
export const Notice = withZoraThemeScope(NoticeInner);
