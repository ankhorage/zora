import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Notice,
  Page,
  PageHeader,
  PageSection,
  Panel,
  Stack,
  Tabs,
  Text,
  Textarea,
  ThemeComposer,
  Toolbar,
  ToolbarAction,
  type ZoraTheme,
  type ZoraThemeMode,
  ZoraThemeScope,
} from '@ankhorage/zora';
import React from 'react';
import { ScrollView, View } from 'react-native';

interface ThemeComposerPageProps {
  theme: ZoraTheme;
  mode: ZoraThemeMode;
  onThemeChange: (theme: ZoraTheme) => void;
  onModeChange: (mode: ZoraThemeMode) => void;
}

const recipeThemes: readonly { label: string; theme: ZoraTheme }[] = [
  {
    label: 'Purple analogous',
    theme: {
      id: 'showcase-purple-analogous',
      name: 'Purple Analogous',
      appCategory: 'utilities_tools',
      primaryColor: '#c084fc',
      harmony: 'analogous',
    },
  },
  {
    label: 'Cyan split-complementary',
    theme: {
      id: 'showcase-cyan-split',
      name: 'Cyan Split',
      appCategory: 'entertainment_media',
      primaryColor: '#22d3ee',
      harmony: 'splitComplementary',
    },
  },
  {
    label: 'Stone analogous',
    theme: {
      id: 'showcase-stone-analogous',
      name: 'Stone Analogous',
      appCategory: 'business_productivity',
      primaryColor: '#78716c',
      harmony: 'analogous',
    },
  },
  {
    label: 'Pink split-complementary',
    theme: {
      id: 'showcase-pink-split',
      name: 'Pink Split',
      appCategory: 'lifestyle',
      primaryColor: '#ec4899',
      harmony: 'splitComplementary',
    },
  },
  {
    label: 'Blue triadic',
    theme: {
      id: 'showcase-blue-triadic',
      name: 'Blue Triadic',
      appCategory: 'developer_tools',
      primaryColor: '#2563eb',
      harmony: 'triadic',
    },
  },
];

export function ThemeComposerPage({
  theme,
  mode,
  onThemeChange,
  onModeChange,
}: ThemeComposerPageProps) {
  const [previewTab, setPreviewTab] = React.useState('overview');

  return (
    <ScrollView>
      <Page
        header={
          <PageHeader
            eyebrow="Theme lab"
            title="Theme Composer"
            description="Edit the active ZORA theme seed and inspect how primary color, harmony, and mode affect real UI surfaces."
          />
        }
      >
        <PageSection title="Composer">
          <ThemeComposer
            value={theme}
            onChange={onThemeChange}
            mode={mode}
            onModeChange={onModeChange}
          />
        </PageSection>

        <PageSection title="Recipe presets">
          <Stack direction="row" gap="s" wrap="wrap">
            {recipeThemes.map((preset) => (
              <Button
                key={preset.theme.id}
                emphasis={theme.id === preset.theme.id ? 'solid' : 'soft'}
                size="s"
                tone="primary"
                onPress={() => onThemeChange(preset.theme)}
              >
                {preset.label}
              </Button>
            ))}
          </Stack>
        </PageSection>

        <ZoraThemeScope mode={mode}>
          <PageSection title="Live preview">
            <Notice
              title="Preview follows the active theme"
              description="The whole showcase app receives the edited theme seed. This preview also scopes light and dark mode without relying on provider remounts."
              tone="primary"
            />

            <Panel
              title="Surface area"
              description="Panel, toolbar, cards, badges, form controls, and navigation should remain legible across the target recipe combinations."
            >
              <Stack gap="m">
                <Toolbar position="inline">
                  <ToolbarAction active icon={{ name: 'color-palette-outline' }} label="Design" />
                  <ToolbarAction icon={{ name: 'sparkles-outline' }} label="Generate" />
                  <ToolbarAction icon={{ name: 'eye-outline' }} label="Preview" />
                  <View style={{ flex: 1 }} />
                  <ToolbarAction icon={{ name: 'save-outline' }} label="Save" />
                </Toolbar>

                <Tabs
                  value={previewTab}
                  onValueChange={setPreviewTab}
                  variant="segmented"
                  items={[
                    { value: 'overview', label: 'Overview' },
                    { value: 'inputs', label: 'Inputs' },
                    { value: 'states', label: 'States' },
                  ]}
                />

                <Card
                  title="App dashboard"
                  description="A representative content card with actions and mixed badge tones."
                  actions={
                    <Button size="s" trailingIcon={{ name: 'arrow-forward-outline' }}>
                      Continue
                    </Button>
                  }
                  footer={
                    <Stack direction="row" gap="s" wrap="wrap">
                      <Badge tone="primary">Primary</Badge>
                      <Badge tone="success" emphasis="soft">
                        Success
                      </Badge>
                      <Badge tone="warning" emphasis="soft">
                        Warning
                      </Badge>
                      <Badge tone="danger" emphasis="outline">
                        Danger
                      </Badge>
                    </Stack>
                  }
                >
                  <Stack gap="s">
                    <Text variant="lead" tone="muted">
                      Active harmony: {theme.harmony}. Primary: {theme.primaryColor}.
                    </Text>
                    <Text>
                      Use this surface to catch contrast, tint, nested card, and action-color issues
                      before generated apps consume the theme.
                    </Text>
                  </Stack>
                </Card>

                <Card
                  title="Form controls"
                  description="Inputs and textareas should stay readable on themed surfaces."
                  tone="subtle"
                >
                  <Stack gap="s">
                    <Input value={theme.primaryColor} />
                    <Textarea
                      value="Theme notes, accessibility observations, and recipe QA details."
                      rows={3}
                    />
                    <Stack direction="row" gap="s" wrap="wrap">
                      <Button tone="primary">Primary action</Button>
                      <Button tone="neutral" emphasis="soft">
                        Secondary
                      </Button>
                      <Button tone="danger" emphasis="ghost">
                        Danger ghost
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </Panel>
          </PageSection>

          <PageSection title="Empty state preview">
            <EmptyState
              title="No generated screens yet"
              description="Empty states should use subtle theme tinting without losing text contrast or action clarity."
              primaryAction={{ label: 'Generate screen', onPress: () => undefined }}
              secondaryAction={{ label: 'Import template', onPress: () => undefined }}
            />
          </PageSection>
        </ZoraThemeScope>
      </Page>
    </ScrollView>
  );
}
