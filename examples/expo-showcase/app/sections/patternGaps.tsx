import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  IconButton,
  Notice,
  PageSection,
  Panel,
  ResponsivePanel,
  SectionHeader,
  SettingsRow,
  Stack,
  SwitchField,
  Text,
  TreeItem,
} from '@ankhorage/zora';
import React from 'react';

export function PatternGapsSection() {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [syncEnabled, setSyncEnabled] = React.useState(true);

  return (
    <PageSection title="Additional patterns">
      <SectionHeader
        title="Dialogs and panels"
        description="Focused confirmation and contextual panel patterns."
      />

      <Card
        title="ConfirmDialog"
        description="Use confirm dialogs for destructive or important decisions."
        actions={
          <Button size="s" tone="danger" emphasis="soft" onPress={() => setConfirmOpen(true)}>
            Open confirm
          </Button>
        }
      >
        <Text tone="muted" variant="bodySmall">
          Opens a mock confirmation dialog without performing a real action.
        </Text>
      </Card>

      <Panel
        title="Panel"
        description="Panels compose title, description, actions, footer, and content."
        actions={<IconButton icon={{ name: 'settings-outline' }} label="Panel settings" size="s" />}
        footer={<Badge tone="success">Ready</Badge>}
      >
        <Notice
          tone="primary"
          title="Panel content"
          description="This is a compact panel example inside the pattern catalog."
        />
      </Panel>

      <ResponsivePanel
        title="ResponsivePanel"
        description="Inline on desktop, drawer or modal in floating mode."
        open={panelOpen}
        onOpenChange={setPanelOpen}
        actions={
          <Button size="s" emphasis="soft" onPress={() => setPanelOpen(false)}>
            Hide
          </Button>
        }
      >
        <Stack gap="s">
          <Text>Inline responsive panel content.</Text>
          <Button size="s" emphasis="soft" onPress={() => setPanelOpen(true)}>
            Reopen
          </Button>
        </Stack>
      </ResponsivePanel>
      {panelOpen ? null : (
        <Button size="s" emphasis="soft" onPress={() => setPanelOpen(true)}>
          Show responsive panel
        </Button>
      )}

      <SectionHeader
        title="Settings rows"
        description="SettingsRow works for static, pressable, and controlled settings content."
      />
      <Card title="SettingsRow" tone="subtle">
        <Stack gap="s">
          <SettingsRow
            title="Account plan"
            description="Static metadata row."
            meta={<Badge tone="primary">Pro</Badge>}
          />
          <SettingsRow
            title="Open billing"
            description="Pressable row with a mock action."
            onPress={() => undefined}
            meta="⌘B"
          />
          <SettingsRow
            title="Background sync"
            description="Controlled settings row."
            control={
              <SwitchField
                label="Background sync"
                value={syncEnabled}
                onValueChange={setSyncEnabled}
              />
            }
          />
        </Stack>
      </Card>

      <SectionHeader
        title="TreeItem"
        description="TreeItem is exported directly and can be shown without a full TreeView."
      />
      <Card title="Standalone TreeItem" tone="subtle">
        <TreeItem
          node={{ id: 'direct-tree-item', label: 'Direct TreeItem export', meta: 'tsx' }}
          depth={0}
          expandedIds={[]}
          onToggleExpand={() => undefined}
        />
      </Card>

      <ConfirmDialog
        visible={confirmOpen}
        title="Delete showcase item?"
        description="This is a mock confirmation dialog for visual coverage."
        confirmLabel="Delete"
        confirmTone="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </PageSection>
  );
}
