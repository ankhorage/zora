import {
  AvatarGroup,
  Badge,
  Card,
  MediaCard,
  Page,
  PageHeader,
  PageSection,
  Text,
} from '@ankhorage/zora';

export default function StatusScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Status"
          description="Short-lived updates from contacts and groups."
          actions={<Badge tone="primary">4 updates</Badge>}
        />
      }
    >
      <PageSection
        title="My status"
        description="A simple preview card for the current user's update."
      >
        <MediaCard
          title="Share an update"
          description="Post a photo, note, or quick availability update."
          imageSource={{
            uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
          }}
          imageLabel="People at a small gathering"
          badges={<Badge tone="success">Ready</Badge>}
        />
      </PageSection>

      <PageSection
        title="Recent updates"
        description="Status previews compose existing ZORA cards and media surfaces."
      >
        <Card
          title="Design Systems Circle"
          description="Noah shared three critique snapshots from the workshop."
          actions={
            <AvatarGroup
              items={[
                { id: 'noah', name: 'Noah Keller', tone: 'success' },
                { id: 'mia', name: 'Mia Chen', tone: 'primary' },
                { id: 'lea', name: 'Lea Meyer', tone: 'warning' },
              ]}
            />
          }
        >
          <Text tone="muted">
            A future Status pattern could model rings, expiry, and grouped story states.
          </Text>
        </Card>
      </PageSection>
    </Page>
  );
}
