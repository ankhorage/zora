import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Box } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { AppShellProps } from './types';

function AppShellInner({
  themeId: _themeId,
  mode: _mode,
  children,
  header,
  footer,
  overlay,
  style,
  bodyStyle,
  testID,
}: AppShellProps) {
  return (
    <Box bg="background" flex={1} style={style} testID={testID}>
      <View style={styles.root}>
        {header ? <View style={styles.slot}>{header}</View> : null}

        <View style={[styles.body, bodyStyle]}>{children}</View>

        {footer ? <View style={styles.slot}>{footer}</View> : null}

        {overlay ? (
          <View pointerEvents="box-none" style={styles.overlay}>
            {overlay}
          </View>
        ) : null}
      </View>
    </Box>
  );
}

export const AppShell = withZoraThemeScope(AppShellInner);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    position: 'relative',
  },
  body: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
  },
  slot: {
    flexShrink: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});
