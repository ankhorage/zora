import {
  AvatarGroup,
  Badge,
  Card,
  ListSection,
  Page,
  PageHeader,
  PageSection,
  Text,
} from '@ankhorage/zora';

const groupRows = [
  {
    title: 'Design Systems Circle',
    description: 'Weekly critiques, component decisions, and shared UI notes.',
    meta: '128 members',
    variant: 'card' as const,
  },
  {
    title: 'Founders Lounge',
    description: 'Product builders trading launch notes and early customer feedback.',
    meta: '84 members',
    variant: 'card' as const,
  },
  {
    title: 'Mobile Makers',
    description: 'Patterns for native-first app experiences and cross-platform details.',
    meta: '212 members',
    variant: 'card' as const,
  },
] as const;

export default function GroupsScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Groups"
          description="Follow active spaces, upcoming events, and moderation needs."
          actions={<Badge tone="primary">3 active</Badge>}
        />
      }
    >
      <ScreenSection
        title="Featured room"
        description="A composed ZORA card for the most active group."
      >
        <Card
          title="Design systems circle"
          description="128 members · 14 new posts · weekly critique on Friday."
          actions={
            <AvatarGroup
              items={[
                { id: 'mia', name: 'Mia Chen' },
                { id: 'noah', name: 'Noah Keller', tone: 'success' },
                { id: 'lea', name: 'Lea Meyer', tone: 'warning' },
              ]}
            />
          }
        >
          <Text tone="muted">The screen stays realistic without local layout wrappers.</Text>
        </Card>
      </ScreenSection>

      <ListSection
        title="Your groups"
        description="Static data now, template data binding later."
        items={groupRows}
      />
    </Page>
  );
}
