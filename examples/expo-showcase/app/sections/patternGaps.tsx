import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  ContentRail,
  IconButton,
  ListRow,
  MissingElement,
  Notice,
  Panel,
  ReaderSurface,
  ScreenSection,
  SectionHeader,
  Text,
  TreeItem,
  View,
} from '@ankhorage/zora';
import React from 'react';

export function PatternGapsSection() {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [syncEnabled, setSyncEnabled] = React.useState(true);
  const [readerPage, setReaderPage] = React.useState(2);

  return (
    <ScreenSection title="Additional patterns">
      <SectionHeader
        title="ContentRail"
        description="Responsive horizontal shelves with a partial-next affordance and accessible controls."
      />
      <ContentRail accessibilityLabel="Featured reading" itemSize="responsive">
        {['The North Wind', 'Borrowed Light', 'A Map of Rain', 'Small Hours'].map(
          (title, index) => (
            <Card
              key={title}
              description={`A focused manifest child · ${index + 1}`}
              title={title}
              tone="subtle"
            >
              <Text emphasis="muted" variant="bodySmall">
                ContentRail sizes and scrolls generic children without owning their data or routes.
              </Text>
            </Card>
          ),
        )}
      </ContentRail>

      <SectionHeader
        title="ReaderSurface"
        description="Adapter-neutral EPUB/PDF chrome around an injected viewport."
      />
      <ReaderSurface
        chapterLabel="Chapter 1 · A quiet beginning"
        format="epub"
        onNextPage={() => setReaderPage((page) => Math.min(6, page + 1))}
        onOpenAppearance={() => undefined}
        onOpenContents={() => undefined}
        onPreviousPage={() => setReaderPage((page) => Math.max(1, page - 1))}
        page={readerPage}
        pageCount={6}
        status="ready"
        subtitle="EPUB preview"
        title="The North Wind"
        viewport={
          <View gap="m" p="l">
            <Text variant="eyebrow">Chapter one</Text>
            <Text variant="lead">A quiet beginning</Text>
            <Text>
              This static page stands in for the platform renderer. The ReaderSurface owns the
              chrome while the Expo adapter will own EPUB/PDF rendering and swipe gestures.
            </Text>
          </View>
        }
      />

      <SectionHeader
        title="MissingElement"
        description="Draft-only marker for a semantic ZORA capability that has not been implemented yet."
      />
      <MissingElement
        evidenceId="reference-screen:featured-map"
        minimumHeight={180}
        reason="The current ZORA catalog has no semantic interactive map element."
        requestedCapability="Interactive location map"
      />

      <SectionHeader
        title="Dialogs and panels"
        description="Focused confirmation and contextual panel patterns."
      />

      <Card
        title="ConfirmDialog"
        description="Use confirm dialogs for destructive or important decisions."
        actions={
          <Button size="s" color="danger" variant="soft" onPress={() => setConfirmOpen(true)}>
            Open confirm
          </Button>
        }
      >
        <Text emphasis="muted" variant="bodySmall">
          Opens a mock confirmation dialog without performing a real action.
        </Text>
      </Card>

      <Panel
        title="Panel"
        description="Panels compose title, description, actions, footer, and content."
        actions={<IconButton icon={{ name: 'settings-outline' }} label="Panel settings" size="s" />}
        footer={<Badge color="success">Ready</Badge>}
      >
        <Notice
          color="primary"
          title="Panel content"
          description="This is a compact panel example inside the pattern catalog."
        />
      </Panel>

      <SectionHeader
        title="List rows"
        description="ListRow covers static, pressable, metadata, and trailing-action rows."
      />
      <Card title="ListRow" tone="subtle">
        <View gap="s">
          <ListRow
            title="Account plan"
            description="Static metadata row."
            meta={<Badge color="primary">Pro</Badge>}
          />
          <ListRow
            title="Open billing"
            description="Pressable row with a mock action."
            onPress={() => undefined}
            meta="⌘B"
          />
          <ListRow
            title="Background sync"
            description={syncEnabled ? 'Enabled' : 'Disabled'}
            action={
              <IconButton
                icon={{ name: syncEnabled ? 'pause-outline' : 'play-outline' }}
                label={syncEnabled ? 'Disable background sync' : 'Enable background sync'}
                onPress={() => setSyncEnabled((enabled) => !enabled)}
              />
            }
          />
        </View>
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
        confirmColor="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </ScreenSection>
  );
}
