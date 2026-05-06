import { COLOR_HARMONIES, parseHexColorOrThrow } from '@ankhorage/color-theory';
import type { AppCategory } from '@ankhorage/contracts';
import { APP_CATEGORIES } from '@ankhorage/contracts';
import React from 'react';

import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Heading } from '../../components/heading';
import { Input } from '../../components/input';
import { Select } from '../../components/select';
import { Tabs } from '../../components/tabs';
import { Text } from '../../components/text';
import { Box, Stack } from '../../foundation';
import type { ZoraThemeMode } from '../../theme/types';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ThemeComposerProps } from './types';

const HEX_ERROR_MESSAGE = 'Enter a valid 6-digit hex color (e.g. #0f766e).';
const NAME_ERROR_MESSAGE = 'Theme name cannot be empty.';

function isValidHex(value: string): boolean {
  try {
    parseHexColorOrThrow(value);
    return true;
  } catch {
    return false;
  }
}

function formatAppCategoryLabel(category: AppCategory): string {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
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
  appCategories,
  testID,
}: ThemeComposerProps) {
  const { theme } = useZoraTheme();

  const [hexInput, setHexInput] = React.useState<string>(value.primaryColor);
  const [hexError, setHexError] = React.useState<string | undefined>(undefined);

  const [nameInput, setNameInput] = React.useState<string>(value.name);
  const [nameError, setNameError] = React.useState<string | undefined>(undefined);

  // Keep local inputs in sync when value changes externally
  React.useEffect(() => {
    setHexInput(value.primaryColor);
    setHexError(undefined);
  }, [value.primaryColor]);

  React.useEffect(() => {
    setNameInput(value.name);
    setNameError(undefined);
  }, [value.name]);

  function handleNameChange(text: string) {
    setNameInput(text);
    if (text.trim().length === 0) {
      setNameError(NAME_ERROR_MESSAGE);
    } else {
      setNameError(undefined);
      onChange({ ...value, name: text });
    }
  }

  function handleHexChange(text: string) {
    // Ensure leading hash
    const normalized = text.startsWith('#') ? text : `#${text}`;
    setHexInput(normalized);

    if (isValidHex(normalized)) {
      setHexError(undefined);
      onChange({ ...value, primaryColor: normalized });
    } else {
      setHexError(HEX_ERROR_MESSAGE);
    }
  }

  function handleSubmit() {
    const hasValidName = nameInput.trim().length > 0;
    const hasValidHex = isValidHex(hexInput);

    if (!hasValidName) {
      setNameError(NAME_ERROR_MESSAGE);
    }

    if (!hasValidHex) {
      setHexError(HEX_ERROR_MESSAGE);
    }

    if (!hasValidName || !hasValidHex) {
      return;
    }

    onSubmit?.({
      ...value,
      name: nameInput,
      primaryColor: hexInput,
    });
  }

  const activeMode = mode ?? 'light';
  const categoryOptions = (appCategories ?? APP_CATEGORIES).map((c) => ({
    value: c,
    label: formatAppCategoryLabel(c),
  }));

  return (
    <Stack gap="l" testID={testID}>
      {/* Section: Theme identity */}
      <Card
        title="Theme identity"
        description="Name your theme. The ID is assigned automatically and shown for reference."
      >
        <Stack gap="m">
          <Stack gap="xs">
            <Text variant="label">Name</Text>
            <Input
              value={nameInput}
              onChangeText={handleNameChange}
              placeholder="My theme"
              autoCorrect={false}
              invalid={nameError !== undefined}
              testID={testID ? `${testID}-name-input` : undefined}
            />
            {nameError ? (
              <Text tone="danger" variant="bodySmall">
                {nameError}
              </Text>
            ) : null}
          </Stack>
          <Stack gap="xs">
            <Text variant="label">ID</Text>
            <Text
              tone="muted"
              variant="bodySmall"
              testID={testID ? `${testID}-id-display` : undefined}
            >
              {value.id}
            </Text>
          </Stack>
        </Stack>
      </Card>

      {/* Section: App category */}
      <Card title="App category" description="Choose the category that best describes this app.">
        <Select
          value={value.appCategory}
          options={categoryOptions}
          onValueChange={(c) => onChange({ ...value, appCategory: c })}
          testID={testID ? `${testID}-category-select` : undefined}
        />
      </Card>

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
          <Stack gap="xs">
            <Text variant="label">Name</Text>
            <Text>{value.name}</Text>
          </Stack>
          <Stack gap="xs">
            <Text variant="label">Category</Text>
            <Text>{formatAppCategoryLabel(value.appCategory)}</Text>
          </Stack>
          <Stack gap="xs">
            <Text variant="label">Primary color</Text>
            <Text tone="muted" variant="bodySmall">
              {value.primaryColor}
            </Text>
          </Stack>
          <Stack gap="xs">
            <Text variant="label">Harmony</Text>
            <Text tone="muted" variant="bodySmall">
              {value.harmony}
            </Text>
          </Stack>
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
          onPress={handleSubmit}
          testID={testID ? `${testID}-submit` : undefined}
        >
          Apply theme
        </Button>
      ) : null}
    </Stack>
  );
}

export const ThemeComposer = withZoraThemeScope(ThemeComposerInner);
