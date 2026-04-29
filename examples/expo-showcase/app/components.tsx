import { Stack } from '@ankhorage/surface';
import {
  Badge,
  Button,
  Card,
  CheckboxGroup,
  Drawer,
  IconButton,
  Input,
  Modal,
  Page,
  PageHeader,
  PageSection,
  RadioGroup,
  SectionHeader,
  Select,
  Tabs,
  Textarea,
  Toolbar,
  ToolbarAction,
} from '@ankhorage/zora';
import React from 'react';
import { ScrollView, View } from 'react-native';

export function ComponentsPage() {
  const [tab, setTab] = React.useState('overview');
  const [select, setSelect] = React.useState('starter');
  const [density, setDensity] = React.useState<'comfortable' | 'compact' | 'spacious'>(
    'comfortable',
  );
  const [channels, setChannels] = React.useState<('email' | 'push' | 'sms')[]>(['email']);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <ScrollView>
      <Page
        header={
          <PageHeader
            eyebrow="Component catalog"
            title="Components"
            description="A visual overview of ZORA building blocks across variants, states, and common compositions."
          />
        }
      >
        <PageSection title="Buttons">
          <SectionHeader
            title="Emphasis"
            description="Use emphasis to communicate action strength."
          />
          <Stack direction="row" gap="s" wrap="wrap">
            <Button leadingIcon={{ name: 'add-outline' }}>Primary</Button>
            <Button emphasis="soft" tone="neutral">
              Soft neutral
            </Button>
            <Button emphasis="outline" tone="danger">
              Outline danger
            </Button>
            <Button disabled>Disabled</Button>
          </Stack>

          <SectionHeader
            title="Sizes and icons"
            description="Buttons can be compact or icon-enhanced."
          />
          <Stack direction="row" gap="s" wrap="wrap">
            <Button size="s" leadingIcon={{ name: 'flash-outline' }}>
              Small
            </Button>
            <Button trailingIcon={{ name: 'arrow-forward-outline' }}>Continue</Button>
            <Button emphasis="soft" tone="primary" leadingIcon={{ name: 'sparkles-outline' }}>
              Suggested
            </Button>
          </Stack>
        </PageSection>

        <PageSection title="Icon buttons">
          <SectionHeader
            title="Standalone actions"
            description="Use IconButton for compact toolbar, card, and row actions."
          />
          <Stack direction="row" gap="s" wrap="wrap">
            <IconButton icon={{ name: 'settings-outline' }} label="Settings" />
            <IconButton icon={{ name: 'share-outline' }} label="Share" emphasis="soft" />
            <IconButton
              icon={{ name: 'trash-outline' }}
              label="Delete"
              emphasis="outline"
              tone="danger"
            />
            <IconButton icon={{ name: 'lock-closed-outline' }} label="Locked" disabled />
          </Stack>
        </PageSection>

        <PageSection title="Badges">
          <SectionHeader
            title="Status labels"
            description="Badges work well for state, category, and compact metadata."
          />
          <Stack direction="row" gap="s" wrap="wrap">
            <Badge tone="primary">Primary</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning" emphasis="soft">
              Warning soft
            </Badge>
            <Badge tone="danger" emphasis="outline">
              Danger outline
            </Badge>
            <Badge tone="neutral">Neutral</Badge>
          </Stack>
        </PageSection>

        <PageSection title="Tabs">
          <SectionHeader
            title="Underline"
            description="Default tab style for page-level navigation."
          />
          <Tabs
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'overview', label: 'Overview' },
              { value: 'details', label: 'Details' },
              { value: 'settings', label: 'Settings' },
            ]}
          />

          <SectionHeader title="Pill" description="Soft grouped navigation." />
          <Tabs
            variant="pill"
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'overview', label: 'Overview' },
              { value: 'details', label: 'Details' },
              { value: 'settings', label: 'Settings' },
            ]}
          />

          <SectionHeader title="Segmented" description="Compact segmented control style." />
          <Tabs
            variant="segmented"
            size="s"
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'overview', label: 'Overview' },
              { value: 'details', label: 'Details' },
              { value: 'settings', label: 'Settings' },
            ]}
          />
        </PageSection>

        <PageSection title="Toolbars">
          <SectionHeader title="Inline toolbar" description="Useful for local page actions." />
          <Toolbar position="inline">
            <ToolbarAction icon={{ name: 'play-outline' }} label="Run" />
            <ToolbarAction icon={{ name: 'pause-outline' }} label="Pause" />
            <ToolbarAction icon={{ name: 'stop-outline' }} label="Stop" />
            <View style={{ flex: 1 }} />
            <ToolbarAction icon={{ name: 'download-outline' }} label="Export" />
          </Toolbar>

          <SectionHeader title="Floating toolbar" description="Useful for editor-like surfaces." />
          <Toolbar position="inline" floating>
            <ToolbarAction active icon={{ name: 'brush-outline' }} label="Design" />
            <ToolbarAction icon={{ name: 'code-outline' }} label="Code" />
            <ToolbarAction icon={{ name: 'eye-outline' }} label="Preview" />
          </Toolbar>
        </PageSection>

        <PageSection title="Forms">
          <SectionHeader
            title="Inputs"
            description="Basic form controls for search, selection, and text entry."
          />
          <Select
            value={select}
            onValueChange={setSelect}
            options={[
              { value: 'starter', label: 'Starter' },
              { value: 'team', label: 'Team' },
              { value: 'enterprise', label: 'Enterprise' },
            ]}
          />
          <Input placeholder="Search components" leadingIcon={{ name: 'search-outline' }} />
          <Input placeholder="Disabled input" disabled />
          <Textarea placeholder="Textarea multi-line" rows={3} />

          <SectionHeader
            title="Radio groups"
            description="Use RadioGroup when exactly one option in a related set can be active."
          />
          <RadioGroup
            value={density}
            onValueChange={setDensity}
            orientation="horizontal"
            options={[
              {
                value: 'compact',
                label: 'Compact',
                description: 'Dense controls for power users.',
              },
              {
                value: 'comfortable',
                label: 'Comfortable',
                description: 'Balanced spacing for most apps.',
              },
              {
                value: 'spacious',
                label: 'Spacious',
                description: 'Larger touch targets and airy layouts.',
              },
            ]}
          />

          <SectionHeader
            title="Checkbox groups"
            description="Use CheckboxGroup when multiple values from a related set can be selected."
          />
          <CheckboxGroup
            value={channels}
            onValueChange={setChannels}
            options={[
              {
                value: 'email',
                label: 'Email',
                description: 'Send product and account updates by email.',
              },
              {
                value: 'push',
                label: 'Push',
                description: 'Notify active devices immediately.',
              },
              {
                value: 'sms',
                label: 'SMS',
                description: 'Use only for important alerts.',
              },
            ]}
          />
        </PageSection>

        <PageSection title="Cards">
          <SectionHeader
            title="Common card layouts"
            description="Cards combine title, description, actions, content, and footer metadata."
          />
          <Card
            title="Standard card"
            description="A neutral card with descriptive content and a status footer."
            footer={<Badge tone="success">Active</Badge>}
          >
            <Stack direction="row" gap="s" wrap="wrap">
              <Badge tone="primary">Catalog</Badge>
              <Badge tone="neutral" emphasis="soft">
                Stable
              </Badge>
            </Stack>
          </Card>

          <Card
            title="Card with action"
            description="Actions are rendered as trailing controls without making the card itself a nested button."
            actions={
              <Button size="s" emphasis="soft" tone="primary">
                Configure
              </Button>
            }
          />

          <Card
            tone="subtle"
            title="Subtle card"
            description="Use subtle cards for secondary content or nested regions."
          />
        </PageSection>

        <PageSection title="Overlays">
          <SectionHeader
            title="Modal and drawer"
            description="Use overlays for focused decisions and contextual panels."
          />
          <Stack direction="row" gap="s" wrap="wrap">
            <Button onPress={() => setModalOpen(true)}>Open modal</Button>
            <Button emphasis="soft" tone="neutral" onPress={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
          </Stack>
        </PageSection>
      </Page>

      <Modal
        visible={modalOpen}
        onDismiss={() => setModalOpen(false)}
        title="Modal primitive"
        description="Centered overlay for focused tasks."
      >
        <Card tone="subtle" title="Inner content">
          <Input placeholder="Type something..." />
        </Card>
      </Modal>

      <Drawer
        visible={drawerOpen}
        onDismiss={() => setDrawerOpen(false)}
        title="Drawer primitive"
        description="Side overlay for contextual details."
      >
        <Select
          value={select}
          onValueChange={setSelect}
          options={[
            { value: 'starter', label: 'Starter' },
            { value: 'team', label: 'Team' },
            { value: 'enterprise', label: 'Enterprise' },
          ]}
        />
      </Drawer>
    </ScrollView>
  );
}
