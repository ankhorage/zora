import {
  Badge,
  Button,
  Card,
  ContentRail,
  Dialog,
  IconButton,
  ListItem,
  MissingElement,
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
        title="Dialogs and cards"
        description="Compose confirmation actions directly with Dialog and Card."
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

      <Card
        title="Composed card"
        description="Cards already own title, description, actions, footer, and content."
        actions={<IconButton icon={{ name: 'settings-outline' }} label="Card settings" size="s" />}
        footer={<Badge color="success">Ready</Badge>}
      >
        <Text emphasis="muted" variant="bodySmall">
          No additional Panel or Notice wrapper is required.
        </Text>
      </Card>

      <SectionHeader
        title="List rows"
        description="ListItem covers static, pressable, metadata, and trailing-action rows."
      />
      <Card title="ListItem" tone="subtle">
        <View gap="s">
          <ListItem
            title="Account plan"
            description="Static metadata row."
            meta={<Badge color="primary">Pro</Badge>}
          />
          <ListItem
            title="Open billing"
            description="Pressable row with a mock action."
            onPress={() => undefined}
            meta="⌘B"
          />
          <ListItem
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

      <Dialog
        visible={confirmOpen}
        title="Delete showcase item?"
        description="This is a mock confirmation dialog composed from the canonical Dialog API."
        onDismiss={() => setConfirmOpen(false)}
        footer={
          <View direction={{ base: 'column', md: 'row' }} gap="s" justify="flex-end">
            <Button variant="soft" color="neutral" onPress={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" onPress={() => setConfirmOpen(false)}>
              Delete
            </Button>
          </View>
        }
      >
        <Text emphasis="muted" variant="bodySmall">
          Consumers compose confirmation actions explicitly instead of using a preset wrapper.
        </Text>
      </Dialog>
    </ScreenSection>
  );
}
