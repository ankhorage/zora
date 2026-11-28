import { type HexColor, isHexColor } from '@ankhorage/color-theory';
import { useClipboardWriter, writeClipboardTextAsync } from '@ankhorage/runtime';
import { TextInput } from '@ankhorage/surface';
import React from 'react';

import { IconButton } from '../button/public';
import { View } from '../layout/public';
import { useZoraTheme } from '../theme/composition/useZoraTheme';
import { Text } from '../typography/public';

/*** Edits one controlled HEX color and delegates copying to the host-owned clipboard capability. */
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
  const [previousValue, setPreviousValue] = React.useState(value);
  const [copyFeedback, setCopyFeedback] = React.useState<string>();
  const clipboardWriter = useClipboardWriter();
  const { theme } = useZoraTheme();
  if (value !== previousValue) {
    setPreviousValue(value);
    setInput(value);
  }

  return (
    <View gap="xs">
      <TextInput
        accessibilityLabel="Color hex value"
        disabled={disabled}
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
        trailingAccessory={
          <IconButton
            iconName="copy-outline"
            label="Copy color hex value"
            disabled={disabled}
            onPress={() => {
              void writeClipboardTextAsync(clipboardWriter, value).then((result) => {
                setCopyFeedback(
                  result === 'written'
                    ? 'Color hex copied.'
                    : result === 'denied'
                      ? 'Clipboard access was denied.'
                      : 'Clipboard is unavailable.',
                );
              });
            }}
            variant="ghost"
          />
        }
        value={input}
      />
      {copyFeedback ? (
        <Text accessibilityLiveRegion="polite" emphasis="muted" variant="caption">
          {copyFeedback}
        </Text>
      ) : null}
    </View>
  );
}
