import { AvatarGroup, Badge, Card, MediaCard, Screen, ScreenSection, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

export default function StatusScreen() {
  return (
    <>
      <ExampleAppBar
        title="Status"
        subtitle="Short-lived updates from contacts and groups."
        actions={<Badge color="primary">4 updates</Badge>}
      />
      <Screen>
        <ScreenSection
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
            badges={<Badge color="success">Ready</Badge>}
          />
        </ScreenSection>

        <ScreenSection
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
            <Text color="muted">
              A future Status pattern could model rings, expiry, and grouped story states.
            </Text>
          </Card>
        </ScreenSection>
      </Screen>
    </>
  );
}
