import { Box, Heading, Modal as SurfaceModal, Stack, Text } from '@ankhorage/surface';
import React from 'react';

import { resolveDialogWidth } from '../../internal/recipes';
import type { ModalProps } from './types';

export function Modal({
  children,
  title,
  description,
  footer,
  width = 'default',
  ...props
}: ModalProps) {
  const hasHeader = title != null || description != null;

  return (
    <SurfaceModal {...props}>
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
