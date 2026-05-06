import { COLOR_HARMONIES, parseHexColorOrThrow } from '@ankhorage/color-theory';
import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Heading } from '../../components/heading';
import { Input } from '../../components/input';
import { Select } from '../../components/select';
import { Tabs } from '../../components/tabs';
import { Text } from '../../components/text';
import type { ZoraThemeMode } from '../../theme/types';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ThemeComposerProps } from './types';

function isValidHex(value: string): boolean {
  try {
    parseHexColorOrThrow(value);
    return true;
  } catch {
    return false;
  }
}

const HARMONY_OPTIONS = COLOR_HARMONIES.map((h) => ({ value: h, label: h }));

const MODE_TABS = [
  { value: 'light' as ZoraThemeMode, label: 'Light' },
  { value: 'dark' as ZoraThemeMode, label: 'Dark' },
];

function ThemeComposerInner({
  themeId: _themeId,
  value,
  onChange,
  mode,
  onModeChange,
  onSubmit,
  testID,
}: ThemeComposerProps) {
  const { theme } = useZoraTheme();

  const [hexInput, setHexInput] = React.useState<string>(value.primaryColor);
  const [hexError, setHexError] = React.useState<string | undefined>(undefined);

  // Keep local hex input in sync when value.primaryColor changes externally
  React.useEffect(() => {
    setHexInput(value.primaryColor);
    setHexError(undefined);
  }, [value.primaryColor]);

  function handleHexChange(text: string) {
    // Ensure leading hash
    const normalized = text.startsWith('#') ? text : `#${text}`;
    setHexInput(normalized);

    if (isValidHex(normalized)) {
      setHexError(undefined);
      onChange({ ...value, primaryColor: normalized });
    } else {
      setHexError('Enter a valid 6-digit hex color (e.g. #0f766e).');
    }
  }

  const activeMode = mode ?? 'light';

  return (
    <Stack gap="l" testID={testID}>
      {/* Section: Primary Color */}
      <Card title="Primary color" description="Set the seed color for your theme palette.">
        <Stack gap="m">
          <Stack direction="row" gap="m" align="center">
            <Box flex={1}>
              <Input
                value={hexInput}
                onChangeText={handleHexChange}
                placeholder="#0f766e"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={7}
                invalid={hexError !== undefined}
                testID={testID ? `${testID}-hex-input` : undefined}
              />
            </Box>
            {/* Color preview chip */}
            <Box
              width={36}
              height={36}
              radius="m"
              style={{
                backgroundColor: isValidHex(hexInput) ? hexInput : theme.colors.border,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            />
          </Stack>
          {hexError ? (
            <Text tone="danger" variant="bodySmall">
              {hexError}
            </Text>
          ) : null}
        </Stack>
      </Card>

      {/* Section: Harmony */}
      <Card
        title="Harmony"
        description="Choose how accent hues are generated from your primary color."
      >
        <Select
          value={value.harmony}
          options={HARMONY_OPTIONS}
          onValueChange={(h) => onChange({ ...value, harmony: h })}
          testID={testID ? `${testID}-harmony-select` : undefined}
        />
      </Card>

      {/* Section: Mode */}
      <Card title="Mode" description="Switch between light and dark presentation.">
        <Tabs
          value={activeMode}
          items={MODE_TABS}
          onValueChange={(m) => onModeChange?.(m)}
          variant="segmented"
          testID={testID ? `${testID}-mode-tabs` : undefined}
        />
      </Card>

      {/* Section: Preview */}
      <Card title="Preview" description="A quick look at how your theme renders common controls.">
        <Stack gap="m">
          <Heading level={4}>Heading</Heading>
          <Text>Body text — this shows default text color and weight.</Text>
          <Text tone="muted" variant="bodySmall">
            Muted caption text.
          </Text>
          <Stack direction="row" gap="s" align="center">
            <Button tone="primary" emphasis="solid" size="m">
              Primary
            </Button>
            <Button tone="neutral" emphasis="soft" size="m">
              Neutral
            </Button>
            <Button tone="danger" emphasis="ghost" size="m">
              Danger
            </Button>
          </Stack>
          <Stack direction="row" gap="s" align="center">
            <Badge tone="primary">Primary</Badge>
            <Badge tone="success" emphasis="soft">
              Success
            </Badge>
            <Badge tone="warning" emphasis="soft">
              Warning
            </Badge>
            <Badge tone="danger" emphasis="soft">
              Danger
            </Badge>
          </Stack>
          <Card
            tone="subtle"
            title="Nested card"
            description="Subtle tone inside the preview."
            compact
          />
        </Stack>
      </Card>

      {/* Submit */}
      {onSubmit ? (
        <Button
          tone="primary"
          emphasis="solid"
          onPress={() => onSubmit(value)}
          testID={testID ? `${testID}-submit` : undefined}
        >
          Apply theme
        </Button>
      ) : null}
    </Stack>
  );
}

export const ThemeComposer = withZoraThemeScope(ThemeComposerInner);
