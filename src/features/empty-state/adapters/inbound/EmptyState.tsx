import React from 'react';

import type { EmptyStateProps } from '../../../../types/empty-state';
import { Button } from '../../../button/public';
import { Card } from '../../../card/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

function EmptyStateInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
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
      interactionPolicy={interactionPolicy}
      testID={testID}
      title={title}
      tone="subtle"
    >
      <View gap="m">
        {primaryAction || secondaryAction ? (
          <View direction={{ base: 'column', md: 'row' }} gap="s">
            {primaryAction ? (
              <Button
                interactionPolicy={interactionPolicy}
                variant={primaryAction.variant}
                onPress={primaryAction.onPress}
                color={primaryAction.color}
              >
                {primaryAction.label}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button
                interactionPolicy={interactionPolicy}
                variant={secondaryAction.variant ?? 'soft'}
                onPress={secondaryAction.onPress}
                color={secondaryAction.color ?? 'neutral'}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
          </View>
        ) : null}
        {footer}
      </View>
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
