import { Modal as SurfaceModal } from '@ankhorage/surface';
import React, { useCallback, useEffect, useRef } from 'react';

import { Box, Stack } from '../../foundation';
import { resolveDialogWidth } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Heading } from '../heading';
import { Text } from '../text';
import type { ModalProps } from './types';

function useStableCallback(callback: (() => void) | undefined): (() => void) | undefined {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(() => {
    callbackRef.current?.();
  }, []);
}

function ModalInner({
  themeId: _themeId,
  mode: _mode,
  children,
  title,
  description,
  footer,
  width = 'default',
  onDismiss,
  ...props
}: ModalProps) {
  const hasHeader = title != null || description != null;
  const stableOnDismiss = useStableCallback(onDismiss);

  return (
    <SurfaceModal {...props} onDismiss={stableOnDismiss}>
      <Box maxWidth={resolveDialogWidth(width)} style={{ alignSelf: 'center', width: '100%' }}>
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
          {children ? <Box>{children}</Box> : null}
          {footer ? <Box pt="xs">{footer}</Box> : null}
        </Stack>
      </Box>
    </SurfaceModal>
  );
}

export const Modal = withZoraThemeScope(ModalInner);
