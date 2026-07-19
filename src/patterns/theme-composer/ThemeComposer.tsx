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

const HEX_ERROR_MESSAGE = 'Enter a valid 6-digit hex color.';
const HEX_INPUT_PLACEHOLDER = 'Enter hex color';
const NAME_ERROR_MESSAGE = 'Theme name cannot be empty.';

interface InputDraft {
  sourceValue: string;
  inputValue: string;
  error: string | undefined;
}

function createInputDraft(sourceValue: string): InputDraft {
  return { sourceValue, inputValue: sourceValue, error: undefined };
}

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

  const [hexDraft, setHexDraft] = React.useState<InputDraft>(() =>
    createInputDraft(value.primaryColor),
  );
  const [nameDraft, setNameDraft] = React.useState<InputDraft>(() => createInputDraft(value.name));

  const hexDraftIsCurrent = hexDraft.sourceValue === value.primaryColor;
  const hexInput = hexDraftIsCurrent ? hexDraft.inputValue : value.primaryColor;
  const hexError = hexDraftIsCurrent ? hexDraft.error : undefined;

  const nameDraftIsCurrent = nameDraft.sourceValue === value.name;
  const nameInput = nameDraftIsCurrent ? nameDraft.inputValue : value.name;
  const nameError = nameDraftIsCurrent ? nameDraft.error : undefined;

  function handleNameChange(text: string) {
    const error = text.trim().length === 0 ? NAME_ERROR_MESSAGE : undefined;
    setNameDraft({ sourceValue: value.name, inputValue: text, error });

    if (!error) {
      onChange({ ...value, name: text });
    }
  }

  function handleHexChange(text: string) {
    const normalized = text.startsWith('#') ? text : `#${text}`;
    const error = isValidHex(normalized) ? undefined : HEX_ERROR_MESSAGE;
    setHexDraft({ sourceValue: value.primaryColor, inputValue: normalized, error });

    if (!error) {
      onChange({ ...value, primaryColor: normalized });
    }
  }

  function handleSubmit() {
    const hasValidName = nameInput.trim().length > 0;
    const hasValidHex = isValidHex(hexInput);

    if (!hasValidName) {
      setNameDraft({
        sourceValue: value.name,
        inputValue: nameInput,
        error: NAME_ERROR_MESSAGE,
      });
    }

    if (!hasValidHex) {
      setHexDraft({
        sourceValue: value.primaryColor,
        inputValue: hexInput,
        error: HEX_ERROR_MESSAGE,
      });
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
              <Text color="danger" variant="bodySmall">
                {nameError}
              </Text>
            ) : null}
          </Stack>
          <Stack gap="xs">
            <Text variant="label">ID</Text>
            <Text
              emphasis="muted"
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
                placeholder={HEX_INPUT_PLACEHOLDER}
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
            <Text color="danger" variant="bodySmall">
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
            <Text emphasis="muted" variant="bodySmall">
              {value.primaryColor}
            </Text>
          </Stack>
          <Stack gap="xs">
            <Text variant="label">Harmony</Text>
            <Text emphasis="muted" variant="bodySmall">
              {value.harmony}
            </Text>
          </Stack>
          <Heading level={4}>Heading</Heading>
          <Text>Body text — this shows default text color and weight.</Text>
          <Text emphasis="muted" variant="bodySmall">
            Muted caption text.
          </Text>
          <Stack direction="row" gap="s" align="center">
            <Button color="primary" variant="solid" size="m">
              Primary
            </Button>
            <Button color="neutral" variant="soft" size="m">
              Neutral
            </Button>
            <Button color="danger" variant="ghost" size="m">
              Danger
            </Button>
          </Stack>
          <Stack direction="row" gap="s" align="center">
            <Badge color="primary">Primary</Badge>
            <Badge color="success" variant="soft">
              Success
            </Badge>
            <Badge color="warning" variant="soft">
              Warning
            </Badge>
            <Badge color="danger" variant="soft">
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
          color="primary"
          variant="solid"
          onPress={handleSubmit}
          testID={testID ? `${testID}-submit` : undefined}
        >
          Apply theme
        </Button>
      ) : null}
    </Stack>
  );
}

/***
 * UI for composing and applying a theme via structured controls.
 *
 *
 */
export const ThemeComposer = withZoraThemeScope(ThemeComposerInner);
