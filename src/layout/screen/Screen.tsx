import React from 'react';

import { ScrollView, View } from '../../features/layout/public';
import { resolvePageMaxWidth } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ScreenProps } from './types';

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
      gap="l"
      maxWidth={resolvePageMaxWidth(width)}
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

/**
 * Outer content boundary for one app screen.
 *
 * By default Screen owns normal vertical scrolling. Set `scroll={false}` to preserve a bounded
 * viewport and delegate scroll or gesture ownership to specialized children such as lists, maps,
 * chats, canvases, or editors. Content width and page spacing remain stable in both modes.
 */
export const Screen = withZoraThemeScope(ScreenInner);
