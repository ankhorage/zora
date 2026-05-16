import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Card,
  ChipGroup,
  CollectionEditor,
  DisclosureSection,
  EmptyState,
  FilterBar,
  ForgotPasswordForm,
  FormField,
  IconButton,
  ImagePreview,
  ImageUploadField,
  Input,
  InspectorField,
  List,
  ListRow,
  ListSection,
  NavigationItem,
  NavigationList,
  Notice,
  OtpForm,
  PaletteItem,
  Screen,
  ScreenSection,
  SearchBar,
  SelectableItem,
  SelectionProvider,
  SignInForm,
  SignUpForm,
  Stack,
  SwitchField,
  Text,
  TileGrid,
  Timeline,
  TreeView,
  useSelection,
  ZoraDrawerContent,
  type ZoraImageAsset,
  type ZoraPickedImage,
  ZoraTabBar,
} from '@ankhorage/zora';
import React from 'react';
import { Image as ReactNativeImage } from 'react-native';

import iconPng from '../assets/icon.png';
import { PatternGapsSection } from './sections/patternGaps';

interface LayoutSection {
  id: string;
  name: string;
}

function SelectionScenario() {
  const selection = useSelection();

  return (
    <Stack gap="m">
      <AppBar
        appMode={
          selection.hasSelection
            ? {
                type: 'selection',
                label: 'Selected',
                count: selection.selectedCount,
                onCancel: selection.clear,
              }
            : undefined
        }
        overflow={{ label: 'More selection actions', onPress: () => undefined }}
        title={selection.hasSelection ? undefined : 'Selection region'}
        subtitle={
          selection.hasSelection ? undefined : 'Press/longPress/manual triggers are opt-in.'
        }
      />

      <Stack gap="s">
        <SelectableItem id="press-item" trigger="press">
          {({ selected }) => (
            <Card
              compact
              description="Trigger: press"
              title={selected ? 'Selected (press)' : 'Press to select'}
            />
          )}
        </SelectableItem>

        <SelectableItem id="longpress-item" trigger="longPress">
          {({ selected }) => (
            <Card
              compact
              description="Trigger: longPress"
              title={selected ? 'Selected (longPress)' : 'Long press to select'}
            />
          )}
        </SelectableItem>

        <SelectableItem id="manual-item" trigger="manual">
          {({ selected, toggle, clear }) => (
            <Card
              compact
              description="Trigger: manual (consumer-owned interactions)"
              title={selected ? 'Selected (manual)' : 'Manual selection'}
              actions={
                <Stack direction="row" gap="s" align="center">
                  <IconButton
                    icon={{ name: selected ? 'checkbox-outline' : 'square-outline' }}
                    label={selected ? 'Deselect item' : 'Select item'}
                    onPress={toggle}
                    variant="ghost"
                  />
                  {selection.hasSelection ? (
                    <IconButton
                      icon={{ name: 'close-outline' }}
                      label="Clear selection"
                      onPress={clear}
                      variant="ghost"
                    />
                  ) : null}
                </Stack>
              }
            >
              <Text emphasis="muted" variant="bodySmall">
                Consumers own accessibility props and handler wiring in manual mode.
              </Text>
            </Card>
          )}
        </SelectableItem>
      </Stack>
    </Stack>
  );
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
  const [imageAsset, setImageAsset] = React.useState<ZoraImageAsset | null>(null);
  const [simulateUploadError, setSimulateUploadError] = React.useState(false);
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
          <Badge color="primary" variant="soft">
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

  const pickImage = React.useCallback((): Promise<ZoraPickedImage | null> => {
    const resolved = ReactNativeImage.resolveAssetSource(iconPng);
    const { uri } = resolved;

    if (!uri) {
      return Promise.resolve(null);
    }

    return Promise.resolve({
      uri,
      fileName: 'icon.png',
      contentType: 'image/png',
      sizeBytes: 180_000,
    });
  }, []);

  const uploadImage = React.useCallback(
    async (
      picked: ZoraPickedImage,
      { setProgress }: { setProgress: (progress: number | null) => void },
    ): Promise<ZoraImageAsset> => {
      const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

      setProgress(0);
      await delay(180);
      setProgress(0.2);
      await delay(220);
      setProgress(0.55);
      await delay(260);
      setProgress(0.85);
      await delay(180);
      setProgress(1);

      if (simulateUploadError) {
        throw new Error('Simulated upload failure (showcase)');
      }

      return {
        kind: 'storage',
        storageId: 'local-dev',
        bucket: 'showcase',
        path: `images/${Date.now()}-${picked.fileName ?? 'upload'}`,
        publicUrl: picked.uri,
        contentType: picked.contentType,
        width: picked.width,
        height: picked.height,
        metadata: {
          fileName: picked.fileName,
          sizeBytes: picked.sizeBytes,
        },
      };
    },
    [simulateUploadError],
  );

  const removeImage = React.useCallback(async () => {
    const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
    await delay(250);
  }, []);

  return (
    <Screen>
      <ScreenSection title="Scenario: Search and filters">
        <FilterBar
          leading={<SearchBar placeholder="Search items" value={query} onValueChange={setQuery} />}
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
      </ScreenSection>

      <ScreenSection title="Scenario: Image upload field">
        <Card
          title="Provider-neutral upload"
          description="Picking, uploading, and removal are injected via callbacks; ZORA owns only the UI."
          footer={
            <Stack direction={{ base: 'column', md: 'row' }} gap="s">
              <Button
                variant="soft"
                color="neutral"
                onPress={() => setSimulateUploadError((current) => !current)}
              >
                Simulate upload error: {simulateUploadError ? 'On' : 'Off'}
              </Button>
              <Button
                variant="soft"
                color="neutral"
                onPress={() => {
                  setImageAsset(null);
                }}
              >
                Reset value
              </Button>
            </Stack>
          }
        >
          <ImageUploadField
            accept="image/*"
            label="Project image"
            helperText="Showcase uses a local image asset and a fake upload function."
            maxSizeBytes={5_000_000}
            value={imageAsset}
            onChange={setImageAsset}
            onPick={pickImage}
            onUpload={uploadImage}
            onRemove={removeImage}
          />
        </Card>

        <Card
          title="Storage render rule"
          description="Storage assets render only once a publicUrl is provided."
        >
          <Stack gap="m">
            <ImagePreview
              asset={{
                kind: 'storage',
                bucket: 'showcase',
                path: 'pending/example.png',
              }}
            />
            <Text emphasis="muted" variant="caption">
              Consumers are responsible for resolving storage references into public URLs.
            </Text>
          </Stack>
        </Card>

        <Card title="Disabled and read-only">
          <Stack gap="m">
            <ImageUploadField
              label="Disabled field"
              value={imageAsset}
              onChange={setImageAsset}
              onPick={pickImage}
              onUpload={uploadImage}
              disabled
            />
            <ImageUploadField
              label="Read-only field"
              value={imageAsset}
              onChange={setImageAsset}
              onPick={pickImage}
              onUpload={uploadImage}
              readOnly
            />
          </Stack>
        </Card>

        <Card title="External errorText wins">
          <ImageUploadField
            label="Externally invalid"
            value={imageAsset}
            onChange={setImageAsset}
            onPick={pickImage}
            onUpload={uploadImage}
            errorText="External errorText overrides internal validation and upload errors."
          />
        </Card>
      </ScreenSection>

      <ScreenSection title="Scenario: Lists">
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
                <Badge color="neutral" variant="soft">
                  New
                </Badge>
              ),
              onPress: () => undefined,
            },
            {
              title: 'Build pipeline',
              description: 'Main branch build succeeded.',
              meta: 'Today',
              leading: <Avatar initials="CI" size="s" color="primary" />,
              action: <IconButton icon={{ name: 'download-outline' }} label="Download artifacts" />,
            },
            {
              title: 'Grace Hopper',
              description: 'Invited you to review a draft.',
              meta: 'Yesterday',
              leading: <Avatar name="Grace Hopper" size="s" color="success" />,
              disabled: true,
              trailing: (
                <Badge color="neutral" variant="soft">
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
              leading: <Avatar initials="MRR" size="s" color="warning" />,
              trailing: <Badge color="success">Up</Badge>,
              onPress: () => undefined,
            },
            {
              title: 'New users',
              description: 'Signups across mobile and web.',
              leading: <Avatar initials="NU" size="s" color="primary" />,
              trailing: <Badge color="neutral">Today</Badge>,
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
      </ScreenSection>

      <ScreenSection title="Scenario: Selection mode">
        <Card
          title="Contextual selection primitives"
          description="SelectionProvider scopes selection state to a region. SelectableItem supports press, longPress, and manual triggers."
        >
          <SelectionProvider mode="single">
            <SelectionScenario />
          </SelectionProvider>
        </Card>
      </ScreenSection>

      <ScreenSection title="Scenario: Navigation chrome (simulation)">
        <Card
          title="Expo Router chrome"
          description="This section simulates navigator renderer props to demonstrate ZORA tab/drawer chrome. It is not real Expo Router navigation."
        >
          <Stack gap="m">
            <Text emphasis="muted" variant="bodySmall">
              Active tab: {navigationState.routes[navigationState.index]?.name}
            </Text>
            <ZoraTabBar
              descriptors={navigationDescriptors}
              navigation={tabNavigation}
              routeMap={routeMap}
              state={navigationState}
              testID="showcase-tabbar"
            />
            <Text emphasis="muted" variant="bodySmall">
              Drawer status: {drawerStatus}
            </Text>
            <ZoraDrawerContent
              descriptors={navigationDescriptors}
              footer={
                <Text emphasis="subtle" variant="caption">
                  Footer slot
                </Text>
              }
              header={
                <Text emphasis="subtle" variant="caption">
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
      </ScreenSection>

      <ScreenSection title="Scenario: Timeline">
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
      </ScreenSection>

      <ScreenSection title="Scenario: App settings">
        <Notice
          title="Settings saved locally"
          description="This scenario combines form fields, switches, inspector-style controls, and disclosure sections."
          color="primary"
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
            <IconButton icon={{ name: 'refresh-outline' }} label="Reset theme" variant="soft" />
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
      </ScreenSection>

      <ScreenSection title="Scenario: Auth forms">
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

        <Card title="OTP" description="Code verification with a mock resend action." tone="subtle">
          <OtpForm length={6} onResend={handleMockAction} onSubmit={handleMockAction} />
        </Card>
      </ScreenSection>

      <ScreenSection title="Scenario: Editor sidebar">
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
              footer={<Badge color="neutral">Section {index + 1}</Badge>}
            />
          )}
        />
      </ScreenSection>

      <ScreenSection title="Scenario: Theme picker">
        <TileGrid columns={4}>
          <PaletteItem
            title="Ocean"
            description="Blue primary"
            badge={<Badge color="primary">Active</Badge>}
            selected
          />
          <PaletteItem
            title="Rose"
            description="Warm accent"
            badge={
              <Badge color="danger" variant="soft">
                Preview
              </Badge>
            }
          />
          <PaletteItem
            title="Forest"
            description="Green system"
            badge={<Badge color="success">Ready</Badge>}
          />
          <PaletteItem
            title="Amber"
            description="Warning tone"
            badge={
              <Badge color="warning" variant="soft">
                New
              </Badge>
            }
          />
        </TileGrid>
      </ScreenSection>

      <ScreenSection title="Scenario: Empty workflow state">
        <EmptyState
          title="No templates yet"
          description="Create your first reusable template to speed up future app generation."
          primaryAction={{
            label: 'Create template',
            onPress: addItem,
          }}
        />
      </ScreenSection>

      <PatternGapsSection />
    </Screen>
  );
}
