import type React from 'react';

import { View } from '../../layout/public';
import { Text } from '../../typography/public';

/*** Renders the title block shared by picker overlay content. */
export function PickerHeader({ description, title }: PickerHeaderProps) {
  return (
    <View gap="xxs">
      <Text align="center" variant="label" weight="semiBold">
        {title}
      </Text>
      {description ? (
        <Text align="center" emphasis="muted" variant="bodySmall">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

interface PickerHeaderProps {
  readonly description: React.ReactNode | undefined;
  readonly title: React.ReactNode;
}
