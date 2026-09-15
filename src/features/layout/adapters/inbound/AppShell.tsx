import React from 'react';

import type { AppShellProps } from '../../../../types/layout';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { View } from './View';

function AppShellInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  children,
  header,
  footer,
  overlay,
  testID,
}: AppShellProps) {
  return (
    <View bg="background" flex={1} testID={testID}>
      <View flex={1} minHeight={0} position="relative">
        {header ? <View flexShrink={0}>{header}</View> : null}
        <View flex={1} minHeight={0} minWidth={0}>
          {children}
        </View>
        {footer ? <View flexShrink={0}>{footer}</View> : null}
        {overlay ? (
          <View
            bottom={0}
            left={0}
            pointerEvents="box-none"
            position="absolute"
            right={0}
            top={0}
            zIndex={10}
          >
            {overlay}
          </View>
        ) : null}
      </View>
    </View>
  );
}

/*** Root application frame with explicit header, content, footer, and overlay slots. */
export const AppShell = withZoraThemeScope(AppShellInner);
