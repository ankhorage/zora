import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Button,
  IconButton,
  Tabs,
  Toolbar,
  ToolbarAction,
  Select,
  Input,
  Card,
  Badge,
  Modal,
  Drawer,
  Page,
  PageHeader,
  PageSection,
  SectionHeader,
  Textarea,
} from '@ankhorage/zora';

export function ComponentsPage() {
  const [tab, setTab] = React.useState('underline');
  const [select, setSelect] = React.useState('1');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <Page
        header={
          <PageHeader
            title="Components"
            description="Isolated primitives and core building blocks for visual QA."
            eyebrow="Workbench"
          />
        }
      >
        <PageSection title="Buttons & Icons">
          <View style={styles.row}>
            <Button leadingIcon={{ name: 'add-outline' }}>Primary Button</Button>
            <Button emphasis="soft" tone="neutral">Soft Neutral</Button>
            <Button emphasis="outline" tone="danger">Outline Danger</Button>
          </View>
          <View style={styles.row}>
            <IconButton icon={{ name: 'trash-outline' }} label="Delete" tone="danger" />
            <IconButton icon={{ name: 'settings-outline' }} label="Settings" emphasis="soft" />
            <IconButton icon={{ name: 'share-outline' }} label="Share" emphasis="outline" tone="primary" />
          </View>
        </PageSection>

        <PageSection title="Tabs">
          <SectionHeader title="Underline (Default)" />
          <Tabs
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'underline', label: 'Underline' },
              { value: 'pill', label: 'Pill' },
              { value: 'segmented', label: 'Segmented' },
            ]}
          />
          <SectionHeader title="Pill" />
          <Tabs
            variant="pill"
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'underline', label: 'Underline' },
              { value: 'pill', label: 'Pill' },
              { value: 'segmented', label: 'Segmented' },
            ]}
          />
          <SectionHeader title="Segmented" />
          <Tabs
            variant="segmented"
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'underline', label: 'Underline' },
              { value: 'pill', label: 'Pill' },
              { value: 'segmented', label: 'Segmented' },
            ]}
          />
        </PageSection>

        <PageSection title="Toolbar">
          <Toolbar position="inline">
            <ToolbarAction icon={{ name: 'play-outline' }} label="Run" />
            <ToolbarAction icon={{ name: 'pause-outline' }} label="Pause" />
            <ToolbarAction icon={{ name: 'stop-outline' }} label="Stop" />
            <View style={{ flex: 1 }} />
            <ToolbarAction icon={{ name: 'download-outline' }} label="Export" />
          </Toolbar>
          <Toolbar position="inline" floating>
            <ToolbarAction active icon={{ name: 'brush-outline' }} label="Design" />
            <ToolbarAction icon={{ name: 'code-outline' }} label="Code" />
            <ToolbarAction icon={{ name: 'eye-outline' }} label="Preview" />
          </Toolbar>
        </PageSection>

        <PageSection title="Forms">
          <Select
            value={select}
            onValueChange={setSelect}
            options={[
              { value: '1', label: 'Option One' },
              { value: '2', label: 'Option Two' },
              { value: '3', label: 'Option Three' },
            ]}
          />
          <Input placeholder="Standard Input" leadingIcon={{ name: 'search-outline' }} />
          <Textarea placeholder="Textarea multi-line" rows={3} />
        </PageSection>

        <PageSection title="Cards & Badges">
          <Card title="Card Title" description="This is a standard card with a description and actions." footer={<Badge tone="success">Active</Badge>}>
            <View style={styles.row}>
              <Badge tone="primary">Primary</Badge>
              <Badge tone="warning" emphasis="soft">Warning Soft</Badge>
              <Badge tone="danger" emphasis="outline">Danger Outline</Badge>
            </View>
          </Card>
        </PageSection>

        <PageSection title="Overlays">
          <View style={styles.row}>
            <Button onPress={() => setModalOpen(true)}>Open Modal</Button>
            <Button emphasis="soft" tone="neutral" onPress={() => setDrawerOpen(true)}>Open Drawer</Button>
          </View>
        </PageSection>
      </Page>

      <Modal
        visible={modalOpen}
        onDismiss={() => setModalOpen(false)}
        title="Modal Primitive"
        description="Centered overlay for focused tasks."
      >
        <Card tone="subtle" title="Inner Content">
          <Input placeholder="Type something..." />
        </Card>
      </Modal>

      <Drawer
        visible={drawerOpen}
        onDismiss={() => setDrawerOpen(false)}
        title="Drawer Primitive"
        description="Side overlay for contextual details."
      >
        <Select
          value={select}
          onValueChange={setSelect}
          options={[
            { value: '1', label: 'Option One' },
            { value: '2', label: 'Option Two' },
          ]}
        />
      </Drawer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
});
