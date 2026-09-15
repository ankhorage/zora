import {
  AppBar,
  Avatar,
  AvatarGroup,
  Badge,
  View,
  Button,
  ButtonGroup,
  Card,
  CheckboxGroup,
  Chip,
  ChipGroup,
  Dialog,
  Heading,
  IconButton,
  MediaCard,
  MetricCard,
  Pagination,
  Progress,
  ProgressRing,
  RadioGroup,
  Rating,
  Screen,
  ScreenSection,
  SearchInput,
  SectionHeader,
  Select,
  Surface,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextInput,
  Toolbar,
} from '@ankhorage/zora';
import React from 'react';

import { ComponentFormsSection } from './sections/componentForms';
import { FoundationPrimitivesSection } from './sections/foundationPrimitives';
import { LayoutsShowcaseSection } from './sections/layoutsShowcase';

export function ComponentsPage() {
  const [tab, setTab] = React.useState('overview');
  const [select, setSelect] = React.useState('starter');
  const [search, setSearch] = React.useState('');
  const [density, setDensity] = React.useState<'comfortable' | 'compact' | 'spacious'>(
    'comfortable',
  );
  const [chipFilter, setChipFilter] = React.useState<'all' | 'popular' | 'recent'>('all');
  const [channels, setChannels] = React.useState<('email' | 'push' | 'sms')[]>(['email']);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <AppBar
        subtitle="A visual overview of ZORA building blocks across variants, states, and common compositions."
        title="Components"
      />
      <Screen>
        <FoundationPrimitivesSection />

        <ScreenSection title="Typography">
          <SectionHeader
            title="Headings"
            description="Semantic heading levels can use responsive visual sizes and tones."
          />
          <Card title="Heading scale" description="Titles stay theme-aware without raw styles.">
            <View gap="s">
              <Heading level={1} size={{ base: 'h2', md: 'h1' }}>
                Dashboard overview
              </Heading>
              <Heading level={2} color="primary">
                Featured projects
              </Heading>
              <Heading level={3} size="h4" emphasis="muted">
                Compact section title
              </Heading>
            </View>
          </Card>

          <SectionHeader
            title="Text"
            description="Structured body copy, labels, captions, and mono snippets rendered through ZORA."
          />
          <Card title="Variants" description="Recipes stay aligned with the active theme.">
            <View gap="s">
              <Text variant="lead" emphasis="muted">
                Lead copy introduces a screen or important section with a larger measure.
              </Text>
              <Text variant="body">
                Body copy is the default paragraph style for product content and supporting
                explanations.
              </Text>
              <Text variant="bodySmall" emphasis="muted">
                Body small works well for secondary explanations and compact rows.
              </Text>
              <Text variant="caption" emphasis="subtle">
                Caption text is for metadata, timestamps, and helper details.
              </Text>
              <Text variant="label" weight="semiBold">
                Label text
              </Text>
              <Text variant="eyebrow" color="primary">
                Eyebrow text
              </Text>
              <Text variant="code">zora.text.variant</Text>
            </View>
          </Card>

          <Card
            title="Tones and responsive props"
            description="Tone and layout can adapt by breakpoint."
          >
            <View gap="s">
              <Text color="primary" weight="semiBold">
                Primary tone
              </Text>
              <Text color="danger" weight="semiBold">
                Danger tone
              </Text>
              <Text
                align={{ base: 'center', md: 'left' }}
                emphasis="muted"
                variant={{ base: 'bodySmall', md: 'body' }}
              >
                This line uses responsive variant and alignment values.
              </Text>
              <Text numberOfLines={1} emphasis="muted">
                This intentionally long line demonstrates numberOfLines truncation for text that
                needs to fit in constrained product surfaces without exposing raw styles.
              </Text>
            </View>
          </Card>
        </ScreenSection>

        <ScreenSection title="Buttons">
          <SectionHeader
            title="Emphasis"
            description="Use emphasis to communicate action strength."
          />
          <View direction="row" gap="s" wrap="wrap">
            <Button leadingIcon={{ name: 'add-outline' }}>Primary</Button>
            <Button variant="soft" color="neutral">
              Soft neutral
            </Button>
            <Button variant="outline" color="danger">
              Outline danger
            </Button>
            <Button disabled>Disabled</Button>
          </View>

          <SectionHeader
            title="Sizes and icons"
            description="Buttons can be compact or icon-enhanced."
          />
          <View direction="row" gap="s" wrap="wrap">
            <Button size="s" leadingIcon={{ name: 'flash-outline' }}>
              Small
            </Button>
            <Button trailingIcon={{ name: 'arrow-forward-outline' }}>Continue</Button>
            <Button variant="soft" color="primary" leadingIcon={{ name: 'sparkles-outline' }}>
              Suggested
            </Button>
          </View>

          <SectionHeader
            title="Button groups"
            description="Group related actions for dialogs, forms, card footers, and responsive mobile stacks."
          />
          <Card
            title="Responsive action footer"
            description="Stacks vertically on small screens and aligns actions at the end on wider screens."
            footer={
              <ButtonGroup orientation="responsive" align="end">
                <Button variant="soft" color="neutral">
                  Cancel
                </Button>
                <Button>Save changes</Button>
              </ButtonGroup>
            }
          />
          <ButtonGroup align="between">
            <Button variant="ghost" color="neutral">
              Back
            </Button>
            <Button trailingIcon={{ name: 'arrow-forward-outline' }}>Continue</Button>
          </ButtonGroup>
        </ScreenSection>

        <ScreenSection title="Icon buttons">
          <SectionHeader
            title="Standalone actions"
            description="Use IconButton for compact toolbar, card, and row actions."
          />
          <View direction="row" gap="s" wrap="wrap">
            <IconButton icon={{ name: 'settings-outline' }} label="Settings" />
            <IconButton icon={{ name: 'share-outline' }} label="Share" variant="soft" />
            <IconButton
              icon={{ name: 'trash-outline' }}
              label="Delete"
              variant="outline"
              color="danger"
            />
            <IconButton icon={{ name: 'lock-closed-outline' }} label="Locked" disabled />
          </View>
        </ScreenSection>

        <ScreenSection title="Badges">
          <SectionHeader
            title="Status labels"
            description="Badges work well for state, category, and compact metadata."
          />
          <View direction="row" gap="s" wrap="wrap">
            <Badge color="primary">Primary</Badge>
            <Badge color="success">Success</Badge>
            <Badge color="warning" variant="soft">
              Warning soft
            </Badge>
            <Badge color="danger" variant="outline">
              Danger outline
            </Badge>
            <Badge color="neutral">Neutral</Badge>
          </View>
        </ScreenSection>

        <ScreenSection title="Tabs">
          <SectionHeader
            title="Accessible tabs"
            description="Tabs switch one active content panel; chips remain value and filter controls."
          />
          <Tabs value={tab} onValueChange={setTab}>
            <TabList>
              <Tab label="Overview" value="overview" />
              <Tab label="Details" value="details" />
              <Tab label="Settings" value="settings" />
            </TabList>
            <TabPanel value="overview">
              <Text emphasis="muted">Overview panel content.</Text>
            </TabPanel>
            <TabPanel value="details">
              <Text emphasis="muted">Details panel content.</Text>
            </TabPanel>
            <TabPanel value="settings">
              <Text emphasis="muted">Settings panel content.</Text>
            </TabPanel>
          </Tabs>

          <SectionHeader title="Chips" description="Compact filters and value selection." />
          <View gap="s">
            <ChipGroup
              value={chipFilter}
              onValueChange={setChipFilter}
              items={[
                { value: 'all', label: 'All' },
                { value: 'popular', label: 'Popular' },
                { value: 'recent', label: 'Recent' },
              ]}
            />
            <View direction="row" gap="s" wrap="wrap">
              <Chip selected color="primary">
                Selected chip
              </Chip>
              <Chip>Static chip</Chip>
            </View>
          </View>
        </ScreenSection>

        <ScreenSection title="Pagination">
          <SectionHeader
            title="Paged results"
            description="Pagination changes a data page, not an application route."
          />
          <Pagination page={4} pageCount={12} onPageChange={() => undefined} showFirstLast />
        </ScreenSection>

        <ScreenSection title="App bars">
          <SectionHeader
            title="Default"
            description="Product-facing screen chrome built on the Surface AppBar primitive."
          />
          <AppBar
            actions={
              <>
                <IconButton
                  icon={{ name: 'search-outline' }}
                  label="Search"
                  onPress={() => undefined}
                />
              </>
            }
            leading={
              <IconButton
                icon={{ name: 'menu-outline' }}
                label="Open menu"
                onPress={() => undefined}
              />
            }
            overflow={{
              label: 'More actions',
              actions: [
                { id: 'archive', title: 'Archive', onPress: () => undefined },
                { id: 'mark-unread', title: 'Mark unread', onPress: () => undefined },
              ],
            }}
            subtitle="All conversations"
            title="Inbox"
          />

          <SectionHeader
            title="Selection mode"
            description="Generic selection-mode rendering stays prop-driven and reusable."
          />
          <AppBar
            actions={
              <>
                <IconButton
                  variant="ghost"
                  icon={{ name: 'trash-outline' }}
                  label="Delete"
                  color="danger"
                  onPress={() => undefined}
                />
              </>
            }
            appMode={{
              type: 'selection',
              label: 'Selected',
              count: 3,
              onCancel: () => undefined,
            }}
            overflow={{
              label: 'More selection actions',
              actions: [
                { id: 'move', title: 'Move selected', onPress: () => undefined },
                { id: 'archive', title: 'Archive selected', onPress: () => undefined },
              ],
            }}
          />
        </ScreenSection>

        <ScreenSection title="Toolbars">
          <SectionHeader
            title="Visible actions"
            description="Toolbar groups visible contextual controls; layout decides where it is placed."
          />
          <Toolbar>
            <IconButton icon={{ name: 'play-outline' }} label="Run" />
            <IconButton icon={{ name: 'pause-outline' }} label="Pause" />
            <IconButton icon={{ name: 'stop-outline' }} label="Stop" />
            <View flex={1} />
            <IconButton icon={{ name: 'download-outline' }} label="Export" />
          </Toolbar>

          <SectionHeader title="Floating tone" description="Floating only changes presentation." />
          <Toolbar floating>
            <IconButton
              color="primary"
              icon={{ name: 'brush-outline' }}
              label="Design"
              variant="soft"
            />
            <IconButton icon={{ name: 'code-outline' }} label="Code" />
            <IconButton icon={{ name: 'eye-outline' }} label="Preview" />
          </Toolbar>
        </ScreenSection>

        <ScreenSection title="Forms">
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
          <SearchInput placeholder="Search components" value={search} onValueChange={setSearch} />
          <TextInput placeholder="Disabled input" disabled />
          <TextInput multiline numberOfLines={3} placeholder="Textarea multi-line" />

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
        </ScreenSection>

        <ComponentFormsSection />

        <ScreenSection title="Cards">
          <SectionHeader
            title="Common card layouts"
            description="Cards combine title, description, actions, content, and footer metadata."
          />
          <Card
            title="Standard card"
            description="A neutral card with descriptive content and a status footer."
            footer={<Badge color="success">Active</Badge>}
          >
            <View direction="row" gap="s" wrap="wrap" align="center">
              <Avatar name="Zora Kit" />
              <AvatarGroup
                items={[
                  { id: '1', name: 'Fabio Gartenmann' },
                  { id: '2', name: 'Ada Lovelace', color: 'primary' },
                  { id: '3', name: 'Grace Hopper', color: 'success' },
                  { id: '4', name: 'Linus Torvalds', color: 'warning' },
                  { id: '5', name: 'Lynn Conway', color: 'danger' },
                ]}
              />
            </View>
            <View direction="row" gap="s" wrap="wrap">
              <Badge color="primary">Catalog</Badge>
              <Badge color="neutral" variant="soft">
                Stable
              </Badge>
            </View>
          </Card>

          <Card
            title="Card with action"
            description="Actions are rendered as trailing controls without making the card itself a nested button."
            actions={
              <Button size="s" variant="soft" color="primary">
                Configure
              </Button>
            }
          />

          <Card
            tone="subtle"
            title="Subtle card"
            description="Use subtle cards for secondary content or nested regions."
          />

          <SectionHeader
            title="Media and metrics"
            description="Media cards and metric cards are ready-made product surfaces for listings and dashboards."
          />
          <MediaCard
            badges={
              <View direction="row" gap="s" wrap="wrap">
                <Badge color="primary">Featured</Badge>
                <Badge color="neutral" variant="soft">
                  Cross-platform
                </Badge>
              </View>
            }
            description="Compose an image slot, title/description, badges, actions, footer metadata, and optional children."
            footer={
              <View direction="row" gap="s" wrap="wrap">
                <Rating value={4.5} />
                <Badge color="success">Open</Badge>
              </View>
            }
            image={
              <Surface
                variant="subtle"
                p="m"
                style={{ aspectRatio: 16 / 9, alignItems: 'center', justifyContent: 'center' }}
              >
                <Avatar initials="Z" size="l" color="primary" />
              </Surface>
            }
            onPress={() => undefined}
            title="MediaCard"
          />

          <View direction={{ base: 'column', md: 'row' }} gap="m" wrap="wrap">
            <MetricCard
              delta="+4.1%"
              deltaColor="success"
              description="Last 30 days"
              icon={{ name: 'trending-up-outline' }}
              label="Monthly active users"
              value="14.2k"
            />
            <MetricCard
              delta="-2.3%"
              deltaColor="danger"
              description="Compared to last week"
              icon={{ name: 'pulse-outline' }}
              label="Conversion"
              value="3.7%"
            />
          </View>

          <Card title="Progress" description="Linear progress v1 using semantic tones.">
            <View gap="m">
              <Progress value={72} />
              <Progress color="success" value={38} />
              <Progress color="warning" value={55} />
            </View>
          </Card>

          <Card
            title="Progress rings"
            description="Circular determinate progress supports serializable center value and label compositions."
          >
            <View direction="row" gap="l" wrap="wrap">
              <ProgressRing
                accessibilityLabel="Library read"
                accessibilityValueText="68% of your library read"
                centerLabel="of your library read"
                centerValue="68%"
                value={68}
              />
              <ProgressRing
                accessibilityLabel="Annual reading goal"
                accessibilityValueText="16 of 24 books"
                centerLabel="of 24 books"
                centerValue="16"
                color="success"
                max={24}
                value={16}
              />
            </View>
          </Card>
        </ScreenSection>

        <LayoutsShowcaseSection />

        <ScreenSection title="Overlays">
          <SectionHeader title="Dialog" description="Use dialogs for focused decisions." />
          <ButtonGroup align="start">
            <Button onPress={() => setDialogOpen(true)}>Open dialog</Button>
          </ButtonGroup>
        </ScreenSection>
      </Screen>

      <Dialog
        visible={dialogOpen}
        onDismiss={() => setDialogOpen(false)}
        title="Dialog"
        description="Product-level dialog composition backed by the Surface modal primitive."
      >
        <Card tone="subtle" title="Inner content">
          <TextInput placeholder="Type something..." />
        </Card>
      </Dialog>
    </>
  );
}
