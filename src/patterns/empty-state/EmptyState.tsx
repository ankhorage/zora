import { Stack } from '@ankhorage/surface';
import React from 'react';

import { Button } from '../../components/button';
import { Card } from '../../components/card';
import type { EmptyStateProps } from './types';

export function EmptyState({
  title,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  footer,
  testID,
}: EmptyStateProps) {
  return (
    <Card
      compact
      description={description}
      eyebrow={eyebrow}
      testID={testID}
      title={title}
      tone="subtle"
    >
      <Stack gap="m">
        {primaryAction || secondaryAction ? (
          <Stack direction={{ base: 'column', md: 'row' }} gap="s">
            {primaryAction ? (
              <Button
                emphasis={primaryAction.emphasis}
                onPress={primaryAction.onPress}
                tone={primaryAction.tone}
              >
                {primaryAction.label}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button
                emphasis={secondaryAction.emphasis ?? 'soft'}
                onPress={secondaryAction.onPress}
                tone={secondaryAction.tone ?? 'neutral'}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
          </Stack>
        ) : null}
        {footer}
      </Stack>
    </Card>
  );
}
