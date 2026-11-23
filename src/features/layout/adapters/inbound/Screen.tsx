import React from 'react';

import type { ScreenProps } from '../../../../types/layout';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { resolvePageMaxWidth } from '../../utils/resolvePageMaxWidth';
import { ScrollView } from './ScrollView';
import { View } from './View';

function ScreenInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  children,
  footer,
  scroll = true,
  width = 'default',
  testID,
}: ScreenProps) {
  const content = (
    <View
      alignSelf="center"
      flex={scroll ? undefined : 1}
      gap="l"
      maxWidth={resolvePageMaxWidth(width)}
      minHeight={scroll ? undefined : 0}
      minWidth={scroll ? undefined : 0}
      px={{ base: 16, md: 24, lg: 32 }}
      py="xl"
      testID={testID}
      width="100%"
    >
      {children}
      {footer}
    </View>
  );

  if (!scroll) {
    return (
      <View bg="background" flex={1} minHeight={0} minWidth={0}>
        {content}
      </View>
    );
  }

  return (
    <ScrollView bg="background" flex={1} minHeight={0} minWidth={0}>
      {content}
    </ScrollView>
  );
}

/*** Screen content boundary with independent width policy and scroll ownership. */
export const Screen = withZoraThemeScope(ScreenInner);
