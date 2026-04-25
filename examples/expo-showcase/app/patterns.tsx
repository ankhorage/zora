import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import {
  Page,
  PageHeader,
  PageSection,
  EmptyState,
  Notice,
  FormField,
  InspectorField,
  SwitchField,
  DisclosureSection,
  CollectionEditor,
  TreeView,
  TileGrid,
  PaletteItem,
  Input,
  IconButton,
} from '@ankhorage/zora';

export function PatternsPage() {
  const [switchVal, setSwitchVal] = React.useState(true);
  const [items, setItems] = React.useState([
    { id: '1', name: 'Header Section' },
    { id: '2', name: 'Main Content' },
    { id: '3', name: 'Footer' },
  ]);

  return (
    <ScrollView style={styles.container}>
      <Page
        header={
          <PageHeader
            title="Patterns"
            description="Semantic blocks and interaction patterns for functional QA."
            eyebrow="Workbench"
          />
        }
      >
        <PageSection title="Feedback & States">
          <Notice
            title="Update Available"
            description="A new version of the design system is ready for migration."
            tone="primary"
          />
          <EmptyState
            title="No Results Found"
            description="Try adjusting your filters or search terms to find what you're looking for."
            primaryAction={{ label: 'Clear Filters', onPress: () => {} }}
          />
        </PageSection>

        <PageSection title="Fields & Controls">
          <FormField label="Username" description="Choose a unique name." helperText="Characters: A-Z, 0-9">
            <Input placeholder="johndoe" />
          </FormField>
          
          <InspectorField 
            label="Opacity" 
            control={<IconButton icon={{ name: 'refresh-outline' }} label="Reset" emphasis="soft" />}
          >
            <Input value="100%" />
          </InspectorField>

          <SwitchField 
            label="Hardware Acceleration" 
            description="Use GPU for rendering complex layers."
            value={switchVal}
            onValueChange={setSwitchVal}
          />
        </PageSection>

        <PageSection title="Disclosure & Navigation">
          <DisclosureSection title="Advanced Settings" description="Configure low-level engine parameters.">
            <View style={{ gap: 12 }}>
              <SwitchField label="Debug Mode" value={false} onValueChange={() => {}} />
              <SwitchField label="Verbose Logging" value={true} onValueChange={() => {}} />
            </View>
          </DisclosureSection>

          <View style={styles.treeContainer}>
            <Text style={styles.label}>Tree Hierarchy</Text>
            <TreeView
              nodes={[
                {
                  id: 'root',
                  label: 'Project',
                  children: [
                    { id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] },
                    { id: 'assets', label: 'assets' },
                  ],
                },
              ]}
            />
          </View>
        </PageSection>

        <PageSection title="Collections & Grids">
          <View style={styles.tileSection}>
            <Text style={styles.label}>Color Palette</Text>
            <TileGrid columns={4}>
              <PaletteItem color="#3b82f6" label="Blue 500" />
              <PaletteItem color="#ef4444" label="Red 500" />
              <PaletteItem color="#10b981" label="Green 500" />
              <PaletteItem color="#f59e0b" label="Amber 500" />
            </TileGrid>
          </View>

          <CollectionEditor
            items={items}
            title="Layout Sections"
            onAdd={() => setItems([...items, { id: Date.now().toString(), name: 'New Section' }])}
            onRemove={(id: string) => setItems(items.filter(i => i.id !== id))}
            onMoveUp={(id: string) => {
              const idx = items.findIndex(i => i.id === id);
              if (idx > 0) {
                const next = [...items];
                [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                setItems(next);
              }
            }}
            renderItem={(item: { id: string; name: string }) => (
              <View style={{ padding: 8 }}>
                <Text style={{ fontSize: 14 }}>{item.name}</Text>
              </View>
            )}
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
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  treeContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tileSection: {
    marginBottom: 16,
  }
});
