import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { FormField } from '../form-field';
import type { InspectorFieldProps } from './types';

export function InspectorField({ label, control, children, ...props }: InspectorFieldProps) {
  return (
    <FormField {...props} label={label}>
      <Stack direction="row" gap="s" align="center">
        <Box flex={1}>{children}</Box>
        {control ? <Box>{control}</Box> : null}
      </Stack>
    </FormField>
  );
}
