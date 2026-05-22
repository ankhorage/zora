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
  testID,
}: AppShellProps) {
  return (
    <Box bg="background" flex={1} testID={testID}>
      <View style={styles.root}>
        {header ? <View style={styles.slot}>{header}</View> : null}

        <View style={styles.body}>{children}</View>

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

/***
 * Root application shell with stable header, content, footer, and overlay slots.
 *
 * `AppShell` provides the top-level layout frame for cross-platform apps while
 * leaving navigation, toolbars, and overlays composable through explicit slots.
 *
 
 * @example App frame
 * ```tsx
 * <AppShell header={<AppBar title="Dashboard" />}>...</AppShell>
 * ```
 */
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
