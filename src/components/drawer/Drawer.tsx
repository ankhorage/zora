import { Drawer as SurfaceDrawer } from '@ankhorage/surface';
import React, { useCallback, useEffect, useRef } from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Heading } from '../heading';
import { Text } from '../text';
import type { DrawerProps } from './types';

function useStableCallback(callback: (() => void) | undefined): (() => void) | undefined {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(() => {
    callbackRef.current?.();
  }, []);
}

function DrawerInner({
  themeId: _themeId,
  mode: _mode,
  children,
  title,
  description,
  footer,
  onDismiss,
  ...props
}: DrawerProps) {
  const hasHeader = title != null || description != null;
  const stableOnDismiss = useStableCallback(onDismiss);

  return (
    <SurfaceDrawer {...props} onDismiss={stableOnDismiss}>
      <Stack gap="m">
        {hasHeader ? (
          <Stack gap="xs">
            {title ? <Heading level={3}>{title}</Heading> : null}
            {description ? (
              <Text tone="muted" variant="bodySmall">
                {description}
              </Text>
            ) : null}
          </Stack>
        ) : null}
        {children ? <Box flex={1}>{children}</Box> : null}
        {footer ? <Box pt="xs">{footer}</Box> : null}
      </Stack>
    </SurfaceDrawer>
  );
}

export const Drawer = withZoraThemeScope(DrawerInner);
