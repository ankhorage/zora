import { COLOR_HARMONIES, parseHexColorOrThrow } from '@ankhorage/color-theory';
import type { AppCategory } from '@ankhorage/contracts';
import { APP_CATEGORIES } from '@ankhorage/contracts';
import React from 'react';

import { Tabs } from '../../components/tabs';
import { Badge } from '../../features/badge/public';
import { Button } from '../../features/button/public';
import { Card } from '../../features/card/public';
import { Select } from '../../features/form/select/public';
import { TextInput } from '../../features/form/text-input/public';
import { Box, Stack } from '../../features/layout/public';
import { Heading } from '../../features/typography/public';
import { Text } from '../../features/typography/public';
import type { ZoraThemeMode } from '../../theme/types';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ThemeComposerProps } from './types';

const HEX_ERROR_MESSAGE = 'Enter a valid 6-digit hex color.';
const HEX_INPUT_PLACEHOLDER = 'Enter hex color';
const NAME_ERROR_MESSAGE = 'Theme name cannot be empty.';

interface InputDraft {
  inputValue: string;
  error: string | undefined;
}

function createInputDraft(sourceValue: string): InputDraft {
  return { inputValue: sourceValue, error: undefined };
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
  const [previousPrimaryColor, setPreviousPrimaryColor] = React.useState(value.primaryColor);
  const [previousName, setPreviousName] = React.useState(value.name);

  if (previousPrimaryColor !== value.primaryColor) {
    setPreviousPrimaryColor(value.primaryColor);
    setHexDraft(createInputDraft(value.primaryColor));
  }

  if (previousName !== value.name) {
    setPreviousName(value.name);
    setNameDraft(createInputDraft(value.name));
  }

  function handleNameChange(text: string) {
    const error = text.trim().length === 0 ? NAME_ERROR_MESSAGE : undefined;
    setNameDraft({ inputValue: text, error });

    if (!error) {
      onChange({ ...value, name: text });
    }
  }

  function handleHexChange(text: string) {
    const normalized = text.startsWith('#') ? text : `#${text}`;
    const error = isValidHex(normalized) ? undefined : HEX_ERROR_MESSAGE;
    setHexDraft({ inputValue: normalized, error });

    if (!error) {
      onChange({ ...value, primaryColor: normalized });
    }
  }

  function handleSubmit() {
    const hasValidName = nameDraft.inputValue.trim().length > 0;
    const hasValidHex = isValidHex(hexDraft.inputValue);

    if (!hasValidName) {
      setNameDraft((current) => ({ ...current, error: NAME_ERROR_MESSAGE }));
    }

    if (!hasValidHex) {
      setHexDraft((current) => ({ ...current, error: HEX_ERROR_MESSAGE }));
    }

    if (!hasValidName || !hasValidHex) {
      return;
    }

    onSubmit?.({
      ...value,
      name: nameDraft.inputValue.trim(),
      primaryColor: hexDraft.inputValue,
    });
  }

  return (
    <Stack gap="l" testID={testID}>
      <Stack direction="row" align="center" justify="space-between" gap="m" wrap="wrap">
        <Stack gap="xxs">
          <Heading level={2}>Theme Composer</Heading>
          <Text emphasis="muted" variant="bodySmall">
            Tune the core identity and preview it against the current semantic theme.
          </Text>
        </Stack>
        <Tabs
          items={MODE_TABS}
          value={mode}
          onValueChange={onModeChange}
          variant="segmented"
        />
      </Stack>

      <Card title="Identity" description="Name the theme and choose its primary color.">
        <Stack gap="m">
          <TextInput
            label="Theme name"
            value={nameDraft.inputValue}
            onChangeText={handleNameChange}
            invalid={Boolean(nameDraft.error)}
            errorText={nameDraft.error}
          />
          <TextInput
            label="Primary color"
            value={hexDraft.inputValue}
            onChangeText={handleHexChange}
            placeholder={HEX_INPUT_PLACEHOLDER}
            invalid={Boolean(hexDraft.error)}
            errorText={hexDraft.error}
          />
          <Box
            bg={theme.semantics.surface.raised}
            borderColor={theme.semantics.neutral.divider}
            borderWidth={1}
            radius="m"
            p="m"
          >
            <Stack direction="row" align="center" gap="m">
              <Box
                bg={isValidHex(hexDraft.inputValue) ? hexDraft.inputValue : value.primaryColor}
                height={48}
                radius="m"
                width={48}
              />
              <Stack gap="xxs">
                <Text variant="label" weight="semiBold">
                  Current primary
                </Text>
                <Text emphasis="muted" variant="caption">
                  {hexDraft.inputValue}
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Card>

      <Card title="App category" description="Choose the category that best describes this app.">
        <Select
          value={value.appCategory}
          onValueChange={(appCategory) => onChange({ ...value, appCategory })}
          options={(appCategories ?? APP_CATEGORIES).map((category) => ({
            value: category,
            label: formatAppCategoryLabel(category),
          }))}
        />
      </Card>

      <Card title="Color harmony" description="Select the harmony used to derive supporting colors.">
        <Select
          value={value.harmony}
          onValueChange={(harmony) => onChange({ ...value, harmony })}
          options={HARMONY_OPTIONS}
        />
      </Card>

      <Button onPress={handleSubmit}>Save theme</Button>
    </Stack>
  );
}

/***
 * ZORA theme editing surface for app identity and core color harmony.
 */
export const ThemeComposer = withZoraThemeScope(ThemeComposerInner);
