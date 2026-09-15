import React from 'react';

import type { SectionHeaderProps } from '../../../../types/section';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Heading } from '../../../typography/public';
import { Text } from '../../../typography/public';

function SectionHeaderInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  title,
  description,
  eyebrow,
  actions,
  testID,
}: SectionHeaderProps) {
  return (
    <View
      align={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      gap="m"
      justify="space-between"
      testID={testID}
    >
      <View flex={{ md: 1 }} width={{ base: '100%', md: 'auto' }}>
        <View gap="xs">
          {eyebrow ? (
            <Text emphasis="muted" variant="caption" weight="semiBold">
              {eyebrow}
            </Text>
          ) : null}
          <Heading level={3}>{title}</Heading>
          {description ? (
            <Text emphasis="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
        </View>
      </View>
      {actions ? <View>{actions}</View> : null}
    </View>
  );
}

/***
 * Section heading pattern with optional description and action slot.
 *
 
 */
export const SectionHeader = withZoraThemeScope(SectionHeaderInner);
