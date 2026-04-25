import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  TopbarLayout,
  Toolbar,
  ToolbarAction,
  ResponsivePanel,
  TreeView,
  EmptyState,
  Card,
  InspectorField,
  Select,
  SwitchField,
  CollectionEditor,
  TileGrid,
  PaletteItem,
  IconButton,
  Input,
  Badge,
  TreeItemNode,
} from '@ankhorage/zora';

export function StudioShellPage() {
  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightOpen, setRightOpen] = React.useState(true);
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [theme, setTheme] = React.useState('light');

  const nodes: TreeItemNode[] = [
    {
      id: 'root',
      label: 'App Scene',
      children: [
        { id: 'h1', label: 'Header' },
        { id: 'c1', label: 'Main Content' },
        { id: 'f1', label: 'Footer' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <TopbarLayout
        topbar={
          <Toolbar position="top" floating={false}>
            <IconButton 
              icon={{ name: leftOpen ? 'chevron-back-outline' : 'menu-outline' }} 
              label="Toggle Left" 
              onPress={() => setLeftOpen(!leftOpen)} 
            />
            <View style={{ width: 12 }} />
            <ToolbarAction icon={{ name: 'eye-outline' }} label="Preview" />
            <ToolbarAction icon={{ name: 'save-outline' }} label="Save" />
            <View style={{ flex: 1 }} />
            <Badge tone="success">Live Sync</Badge>
            <View style={{ width: 12 }} />
            <IconButton 
              icon={{ name: rightOpen ? 'chevron-forward-outline' : 'options-outline' }} 
              label="Toggle Right" 
              onPress={() => setRightOpen(!rightOpen)} 
            />
          </Toolbar>
        }
      >
        <View style={styles.workspace}>
          {/* Left Panel - Layers & Palette */}
          <ResponsivePanel 
            open={leftOpen} 
            onOpenChange={setLeftOpen} 
            side="left" 
            title="Scene Graph"
          >
            <View style={styles.panelContent}>
              <TreeView 
                nodes={nodes} 
                onSelect={(node: TreeItemNode) => setSelectedNode(node.id)}
              />
              <View style={styles.divider} />
              <Text style={styles.panelLabel}>Asset Palette</Text>
              <TileGrid columns={3}>
                <PaletteItem color="#3b82f6" label="Text" />
                <PaletteItem color="#ef4444" label="Image" />
                <PaletteItem color="#10b981" label="Button" />
              </TileGrid>
            </View>
          </ResponsivePanel>

          {/* Center Content - Canvas */}
          <View style={styles.canvas}>
            {selectedNode ? (
              <Card 
                title={selectedNode} 
                description="Component Preview Area"
                actions={<IconButton icon={{ name: 'expand-outline' }} label="Focus" />}
              >
                <View style={styles.previewPlaceholder}>
                  <Text style={styles.previewText}>Visualizing: {selectedNode}</Text>
                </View>
              </Card>
            ) : (
              <EmptyState 
                title="No Component Selected" 
                description="Pick a node from the TreeView on the left to start editing properties."
                primaryAction={{ label: 'Add Component', onPress: () => {} }}
              />
            )}
            
            {/* Floating Toolbar at the bottom of canvas */}
            <View style={styles.floatingToolbarContainer}>
              <Toolbar position="inline" floating>
                <ToolbarAction icon={{ name: 'move-outline' }} label="Move" />
                <ToolbarAction icon={{ name: 'resize-outline' }} label="Resize" />
                <ToolbarAction icon={{ name: 'copy-outline' }} label="Duplicate" />
                <ToolbarAction icon={{ name: 'trash-outline' }} label="Delete" />
              </Toolbar>
            </View>
          </View>

          {/* Right Panel - Inspector */}
          <ResponsivePanel 
            open={rightOpen} 
            onOpenChange={setRightOpen} 
            side="right" 
            title="Inspector"
          >
            <View style={styles.panelContent}>
              <InspectorField label="Theme">
                <Select 
                  value={theme} 
                  onValueChange={setTheme}
                  options={[
                    { value: 'light', label: 'Light Mode' },
                    { value: 'dark', label: 'Dark Mode' },
                  ]}
                />
              </InspectorField>
              
              <SwitchField 
                label="Visible" 
                value={true} 
                onValueChange={() => {}} 
              />
              
              <View style={styles.divider} />
              
              <CollectionEditor 
                title="Styles Override"
                items={[{ id: '1', name: 'Border: 1px' }, { id: '2', name: 'Padding: 12px' }]}
                renderItem={(item: { id: string; name: string }) => (
                  <View style={{ padding: 4 }}>
                    <Text style={{ fontSize: 13, color: '#475569' }}>{item.name}</Text>
                  </View>
                )}
                onAdd={() => {}}
                onRemove={() => {}}
              />
            </View>
          </ResponsivePanel>
        </View>
      </TopbarLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  workspace: {
    flex: 1,
    flexDirection: 'row',
  },
  panelContent: {
    flex: 1,
    padding: 12,
    gap: 16,
  },
  canvas: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlaceholder: {
    height: 120,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    color: '#64748b',
    fontWeight: '500',
  },
  floatingToolbarContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  panelLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
