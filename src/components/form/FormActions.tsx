import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { Button } from '../button';
import type { FormActionsProps } from './types';

export function FormActions({
  submitLabel = 'Submit',
  loading = false,
  disabled = false,
  onSubmit,
  children,
  testID,
}: FormActionsProps) {
  return (
    <Stack gap="s" testID={testID}>
      <Button disabled={disabled} fullWidth loading={loading} onPress={onSubmit}>
        {submitLabel}
      </Button>
      {children ? <Box>{children}</Box> : null}
    </Stack>
  );
}
