import { Box, Drawer as SurfaceDrawer, Heading, Stack, Text } from '@ankhorage/surface';
import React from 'react';

import type { DrawerProps } from './types';

export function Drawer({ children, title, description, footer, ...props }: DrawerProps) {
  const hasHeader = title != null || description != null;

  return (
    <SurfaceDrawer {...props}>
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
