import { type HexColor, isHexColor } from '@ankhorage/color-theory';
import { TextInput } from '@ankhorage/surface';
import React from 'react';

import { View } from '../layout/public';
import { useZoraTheme } from '../theme/composition/useZoraTheme';

/*** Edits one controlled HEX color until the host-backed clipboard capability is available. */
export function ColorHexField({
  disabled,
  onChange,
  value,
}: {
  readonly disabled: boolean;
  readonly onChange: (color: HexColor) => void;
  readonly value: HexColor;
}) {
  const [input, setInput] = React.useState<string>(value);
  const { theme } = useZoraTheme();

  return (
    <TextInput
      accessibilityLabel="Color hex value"
      disabled={disabled}
      key={value}
      leadingAccessory={
        <View
          bg={value}
          borderColor={theme.semantics.border.default}
          borderWidth={1}
          height={30}
          radius="s"
          width={30}
        />
      }
      onChangeText={(nextValue) => {
        setInput(nextValue);
        if (isHexColor(nextValue)) onChange(nextValue);
      }}
      value={input}
    />
  );
}
