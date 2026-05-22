import React from 'react';

import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { EmptyStateProps } from './types';

function EmptyStateInner({
  themeId: _themeId,
  mode: _mode,
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
                variant={primaryAction.variant}
                onPress={primaryAction.onPress}
                color={primaryAction.color}
              >
                {primaryAction.label}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button
                variant={secondaryAction.variant ?? 'soft'}
                onPress={secondaryAction.onPress}
                color={secondaryAction.color ?? 'neutral'}
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

/***
 * Reusable fallback state for empty lists, missing data, or first-run experiences.
 *
 * `EmptyState` combines concise copy with optional primary and secondary actions
 * so apps can guide users without custom card and button wiring.
 *
 
 * @example Empty project list
 * ```tsx
 * <EmptyState title="No projects yet" primaryAction={{ label: 'Create project', onPress }} />
 * ```
 */
export const EmptyState = withZoraThemeScope(EmptyStateInner);
