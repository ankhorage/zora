import {
  Badge,
  Card,
  CollectionEditor,
  DisclosureSection,
  EmptyState,
  ForgotPasswordForm,
  FormField,
  IconButton,
  Input,
  InspectorField,
  Notice,
  OtpForm,
  Page,
  PageHeader,
  PageSection,
  PaletteItem,
  SignInForm,
  SignUpForm,
  SwitchField,
  TileGrid,
  TreeView,
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
  const [items, setItems] = React.useState<LayoutSection[]>([
    { id: '1', name: 'Header section' },
    { id: '2', name: 'Main content' },
    { id: '3', name: 'Footer' },
  ]);

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
            <Input value="Ocean / Jewel" />
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
