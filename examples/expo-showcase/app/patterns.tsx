import {
  Avatar,
  Badge,
  Card,
  ChipGroup,
  CollectionEditor,
  DisclosureSection,
  EmptyState,
  FilterBar,
  ForgotPasswordForm,
  FormField,
  IconButton,
  Input,
  InspectorField,
  List,
  ListRow,
  ListSection,
  NavigationItem,
  NavigationList,
  Notice,
  OtpForm,
  Page,
  PageHeader,
  PageSection,
  PaletteItem,
  SearchBar,
  SignInForm,
  SignUpForm,
  Stack,
  SwitchField,
  Text,
  TileGrid,
  Timeline,
  TreeView,
  ZoraDrawerContent,
  ZoraTabBar,
} from '@ankhorage/zora';
import React from 'react';
import { ScrollView } from 'react-native';

import { PatternGapsSection } from './sections/patternGaps';

interface LayoutSection {
  id: string;
  name: string;
}

export function PatternsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(false);
  const [debugMode, setDebugMode] = React.useState(false);
  const [verboseLogging, setVerboseLogging] = React.useState(true);
  const [filters, setFilters] = React.useState<'all' | 'favorites'>('all');
  const [query, setQuery] = React.useState('');
  const [activeNavIndex, setActiveNavIndex] = React.useState(0);
  const [drawerStatus, setDrawerStatus] = React.useState('closed');
  const [items, setItems] = React.useState<LayoutSection[]>([
    { id: '1', name: 'Header section' },
    { id: '2', name: 'Main content' },
    { id: '3', name: 'Footer' },
  ]);

  const navigationState = React.useMemo(
    () => ({
      index: activeNavIndex,
      routes: [
        { key: 'tab-home', name: 'home' },
        { key: 'tab-inbox', name: 'inbox' },
        { key: 'tab-settings', name: 'settings' },
      ] as const,
    }),
    [activeNavIndex],
  );

  const navigationDescriptors = React.useMemo(
    () => ({
      'tab-home': { options: { title: 'Home' } },
      'tab-inbox': { options: { title: 'Inbox' } },
      'tab-settings': { options: { title: 'Settings' } },
    }),
    [],
  );

  const routeMap = React.useMemo(
    () => ({
      home: { label: 'Home', icon: { name: 'home-outline' as const } },
      inbox: {
        label: 'Inbox',
        icon: { name: 'mail-unread-outline' as const },
        badge: (
          <Badge tone="primary" emphasis="soft">
            3
          </Badge>
        ),
      },
      settings: {
        label: 'Settings',
        icon: { name: 'settings-outline' as const },
        disabled: true,
      },
    }),
    [],
  );

  const tabNavigation = React.useMemo(
    () => ({
      emit: () => ({ defaultPrevented: false }),
      navigate: (name: string) => {
        const index = navigationState.routes.findIndex((route) => route.name === name);
        if (index >= 0) {
          setActiveNavIndex(index);
        }
      },
    }),
    [navigationState.routes],
  );

  const drawerNavigation = React.useMemo(
    () => ({
      navigate: tabNavigation.navigate,
      closeDrawer: () => setDrawerStatus('closed'),
    }),
    [tabNavigation.navigate],
  );

  const addItem = () => {
    setItems((currentItems) => [
      ...currentItems,
      {
        id: Date.now().toString(),
        name: 'New section',
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((currentItems) => currentItems.filter((_, itemIndex) => itemIndex !== index));
  };

  const moveItem = (from: number, to: number) => {
    setItems((currentItems) => {
      if (to < 0 || to >= currentItems.length) {
        return currentItems;
      }

      const nextItems = [...currentItems];
      const [movedItem] = nextItems.splice(from, 1);

      if (!movedItem) {
        return currentItems;
      }

      nextItems.splice(to, 0, movedItem);
      return nextItems;
    });
  };
  const handleMockAction = React.useCallback(() => undefined, []);

  return (
    <ScrollView>
      <Page
        header={
          <PageHeader
            eyebrow="Pattern catalog"
            title="Patterns"
            description="Scenario-based examples showing how ZORA patterns compose into real product interfaces."
          />
        }
      >
        <PageSection title="Scenario: Search and filters">
          <FilterBar
            leading={
              <SearchBar placeholder="Search items" value={query} onValueChange={setQuery} />
            }
          >
            <ChipGroup
              value={filters}
              onValueChange={setFilters}
              items={[
                { value: 'all', label: 'All' },
                { value: 'favorites', label: 'Favorites' },
              ]}
            />
          </FilterBar>
        </PageSection>

        <PageSection title="Scenario: Lists">
          <ListSection
            title="Inbox"
            description="Divider rows work well for dense settings and feed-style lists."
            items={[
              {
                title: 'Ada Lovelace',
                description: 'Commented on your proposal.',
                meta: '2 minutes ago',
                leading: <Avatar name="Ada Lovelace" size="s" />,
                trailing: (
                  <Badge tone="neutral" emphasis="soft">
                    New
                  </Badge>
                ),
                onPress: () => undefined,
              },
              {
                title: 'Build pipeline',
                description: 'Main branch build succeeded.',
                meta: 'Today',
                leading: <Avatar initials="CI" size="s" tone="primary" />,
                action: (
                  <IconButton icon={{ name: 'download-outline' }} label="Download artifacts" />
                ),
              },
              {
                title: 'Grace Hopper',
                description: 'Invited you to review a draft.',
                meta: 'Yesterday',
                leading: <Avatar name="Grace Hopper" size="s" tone="success" />,
                disabled: true,
                trailing: (
                  <Badge tone="neutral" emphasis="soft">
                    Archived
                  </Badge>
                ),
              },
            ]}
          />

          <ListSection
            title="Card rows"
            description="Card rows work well for dashboard-style lists."
            rowVariant="card"
            items={[
              {
                title: 'Revenue',
                description: 'Monthly recurring revenue snapshot.',
                leading: <Avatar initials="MRR" size="s" tone="warning" />,
                trailing: <Badge tone="success">Up</Badge>,
                onPress: () => undefined,
              },
              {
                title: 'New users',
                description: 'Signups across mobile and web.',
                leading: <Avatar initials="NU" size="s" tone="primary" />,
                trailing: <Badge tone="neutral">Today</Badge>,
              },
            ]}
          />

          <List>
            <ListRow
              title="Children mode"
              description="List can also render custom children."
              leading={<Avatar initials="Z" size="s" />}
              variant="card"
            />
          </List>
        </PageSection>

        <PageSection title="Scenario: Navigation chrome (simulation)">
          <Card
            title="Expo Router chrome"
            description="This section simulates navigator renderer props to demonstrate ZORA tab/drawer chrome. It is not real Expo Router navigation."
          >
            <Stack gap="m">
              <Text tone="muted" variant="bodySmall">
                Active tab: {navigationState.routes[navigationState.index]?.name}
              </Text>
              <ZoraTabBar
                descriptors={navigationDescriptors}
                navigation={tabNavigation}
                routeMap={routeMap}
                state={navigationState}
                testID="showcase-tabbar"
              />
              <Text tone="muted" variant="bodySmall">
                Drawer status: {drawerStatus}
              </Text>
              <ZoraDrawerContent
                descriptors={navigationDescriptors}
                footer={
                  <Text tone="subtle" variant="caption">
                    Footer slot
                  </Text>
                }
                header={
                  <Text tone="subtle" variant="caption">
                    Header slot
                  </Text>
                }
                navigation={drawerNavigation}
                routeMap={routeMap}
                state={navigationState}
                testID="showcase-drawer"
              />
              <Card
                title="Building blocks (Surface-backed)"
                description="NavigationItem and NavigationList wrap Surface primitives; route metadata comes from routeMap."
              >
                <Stack gap="s">
                  <NavigationItem
                    active
                    metadata={routeMap.home}
                    route={{ key: 'nav-home', name: 'home' }}
                  />
                  <NavigationList
                    activeRouteKey="nav-inbox"
                    onRoutePress={() => setDrawerStatus('open')}
                    routeMap={routeMap}
                    routes={[
                      { key: 'nav-home', name: 'home' },
                      { key: 'nav-inbox', name: 'inbox' },
                      { key: 'nav-settings', name: 'settings' },
                    ]}
                  />
                </Stack>
              </Card>
            </Stack>
          </Card>
        </PageSection>

        <PageSection title="Scenario: Timeline">
          <Timeline
            items={[
              {
                id: '1',
                title: 'Order placed',
                description: 'We have received your request.',
                meta: '09:15',
                status: 'success',
                icon: { name: 'checkmark-outline' },
              },
              {
                id: '2',
                title: 'In transit',
                description: 'Carrier pickup and routing updates.',
                meta: '11:42',
                status: 'primary',
                icon: { name: 'car-outline' },
              },
              {
                id: '3',
                title: 'Requires attention',
                description: 'Address verification failed. Update delivery details.',
                meta: 'Today',
                status: 'warning',
                icon: { name: 'alert-circle-outline' },
              },
            ]}
          />
        </PageSection>

        <PageSection title="Scenario: App settings">
          <Notice
            title="Settings saved locally"
            description="This scenario combines form fields, switches, inspector-style controls, and disclosure sections."
            tone="primary"
          />

          <FormField
            label="Display name"
            description="Shown in shared projects and activity logs."
            helperText="Use a recognizable name for collaborators."
          >
            <Input placeholder="Fabio Gartenmann" />
          </FormField>

          <SwitchField
            label="Enable notifications"
            description="Receive product updates, editor events, and important alerts."
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />

          <SwitchField
            label="Share anonymous analytics"
            description="Help improve the product without sending personal content."
            value={analyticsEnabled}
            onValueChange={setAnalyticsEnabled}
          />

          <InspectorField
            label="Theme preset"
            control={
              <IconButton icon={{ name: 'refresh-outline' }} label="Reset theme" emphasis="soft" />
            }
          >
            <Input value="Ocean" />
          </InspectorField>

          <DisclosureSection
            title="Advanced diagnostics"
            description="Developer-oriented settings for debugging rendering and logs."
          >
            <SwitchField label="Debug mode" value={debugMode} onValueChange={setDebugMode} />
            <SwitchField
              label="Verbose logging"
              value={verboseLogging}
              onValueChange={setVerboseLogging}
            />
          </DisclosureSection>
        </PageSection>

        <PageSection title="Scenario: Auth forms">
          <Card
            title="Sign in"
            description="Provider-agnostic form with validation, form-level errors, and navigation callbacks."
            tone="subtle"
          >
            <SignInForm
              error="Mock signIn error shown at form level."
              identifiers={['email']}
              onForgotPassword={handleMockAction}
              onSignUp={handleMockAction}
              onSubmit={handleMockAction}
            />
          </Card>

          <Card
            title="Sign up"
            description="Loading state with configurable sign-up fields."
            tone="subtle"
          >
            <SignUpForm loading onSignIn={handleMockAction} onSubmit={handleMockAction} />
          </Card>

          <Card
            title="Forgot password"
            description="Disabled state for identifier collection."
            tone="subtle"
          >
            <ForgotPasswordForm
              disabled
              identifiers={['email']}
              onSignIn={handleMockAction}
              onSubmit={handleMockAction}
            />
          </Card>

          <Card
            title="OTP"
            description="Code verification with a mock resend action."
            tone="subtle"
          >
            <OtpForm length={6} onResend={handleMockAction} onSubmit={handleMockAction} />
          </Card>
        </PageSection>

        <PageSection title="Scenario: Editor sidebar">
          <Card title="Project tree" tone="subtle">
            <TreeView
              nodes={[
                {
                  id: 'root',
                  label: 'App',
                  children: [
                    {
                      id: 'screens',
                      label: 'screens',
                      children: [
                        { id: 'home', label: 'Home.tsx' },
                        { id: 'settings', label: 'Settings.tsx' },
                      ],
                    },
                    {
                      id: 'components',
                      label: 'components',
                      children: [
                        { id: 'button', label: 'Button.tsx' },
                        { id: 'card', label: 'Card.tsx' },
                      ],
                    },
                    { id: 'assets', label: 'assets' },
                  ],
                },
              ]}
            />
          </Card>

          <CollectionEditor<LayoutSection>
            items={items}
            title="Layout sections"
            description="A compact editing pattern for ordered, user-managed content."
            addLabel="Add section"
            emptyLabel="No sections yet."
            onAdd={addItem}
            onRemove={removeItem}
            onMove={moveItem}
            renderItem={({ item, index }) => (
              <Card
                compact
                tone="subtle"
                title={item.name}
                footer={<Badge tone="neutral">Section {index + 1}</Badge>}
              />
            )}
          />
        </PageSection>

        <PageSection title="Scenario: Theme picker">
          <TileGrid columns={4}>
            <PaletteItem
              title="Ocean"
              description="Blue primary"
              badge={<Badge tone="primary">Active</Badge>}
              selected
            />
            <PaletteItem
              title="Rose"
              description="Warm accent"
              badge={
                <Badge tone="danger" emphasis="soft">
                  Preview
                </Badge>
              }
            />
            <PaletteItem
              title="Forest"
              description="Green system"
              badge={<Badge tone="success">Ready</Badge>}
            />
            <PaletteItem
              title="Amber"
              description="Warning tone"
              badge={
                <Badge tone="warning" emphasis="soft">
                  New
                </Badge>
              }
            />
          </TileGrid>
        </PageSection>

        <PageSection title="Scenario: Empty workflow state">
          <EmptyState
            title="No templates yet"
            description="Create your first reusable template to speed up future app generation."
            primaryAction={{
              label: 'Create template',
              onPress: addItem,
            }}
          />
        </PageSection>

        <PatternGapsSection />
      </Page>
    </ScrollView>
  );
}
