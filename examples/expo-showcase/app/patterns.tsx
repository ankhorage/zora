import {
  Badge,
  CollectionEditor,
  DisclosureSection,
  EmptyState,
  FormField,
  IconButton,
  Input,
  InspectorField,
  Notice,
  Page,
  PageHeader,
  PageSection,
  PaletteItem,
  SwitchField,
  TileGrid,
  TreeView,
} from '@ankhorage/zora';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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

  return (
    <ScrollView style={styles.container}>
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
            <View style={styles.stack}>
              <SwitchField label="Debug mode" value={debugMode} onValueChange={setDebugMode} />
              <SwitchField
                label="Verbose logging"
                value={verboseLogging}
                onValueChange={setVerboseLogging}
              />
            </View>
          </DisclosureSection>
        </PageSection>

        <PageSection title="Scenario: Editor sidebar">
          <View style={styles.panel}>
            <Text style={styles.label}>Project tree</Text>
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
          </View>

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
              <View style={styles.collectionItem}>
                <Text style={styles.collectionTitle}>{item.name}</Text>
                <Text style={styles.collectionMeta}>Section {index + 1}</Text>
              </View>
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
      </Page>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stack: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  panel: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  collectionItem: {
    padding: 8,
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  collectionMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748b',
  },
});
