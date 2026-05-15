import {
  Avatar,
  Badge,
  Card,
  MediaCard,
  MetricCard,
  Screen,
  ScreenSection,
  Text,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

export default function ProfileScreen() {
  return (
    <>
      <ExampleAppBar
        title="Lina Brooks"
        subtitle="Street color studies, interiors, and quiet city frames."
        actions={<Avatar name="Lina Brooks" color="primary" />}
      />
      <Screen>
        <ScreenSection
          title="Creator profile"
          description="Profile surfaces should feel app-like without custom styles."
        >
          <Card
            title="@linabrooks"
            description="Photographer · Zürich · 128 posts"
            actions={<Badge color="success">Following</Badge>}
          >
            <Text color="muted">Golden hour, street signs, and calm interior details.</Text>
          </Card>
        </ScreenSection>

        <ScreenSection title="Stats">
          <MetricCard
            label="Followers"
            value="24.8k"
            delta="+3.2%"
            deltaTone="success"
            description="Last 30 days"
          />
          <MetricCard label="Saves" value="8.4k" description="Across all posts" />
          <MetricCard label="Collections" value="14" description="Public boards" />
        </ScreenSection>

        <ScreenSection title="Featured post">
          <MediaCard
            title="Terrace light"
            description="A warm, quiet frame from the latest city walk."
            imageSource={{
              uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
            }}
            imageLabel="Warm city terrace at golden hour"
            badges={<Badge color="primary">Featured</Badge>}
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
