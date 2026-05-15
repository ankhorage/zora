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
        title="Mira Stone"
        subtitle="Curator of interiors, market colors, and compact travel boards."
        actions={<Avatar name="Mira Stone" color="primary" />}
      />
      <Screen>
        <ScreenSection
          title="Curator profile"
          description="A Pinterest-style profile built without custom styling."
        >
          <Card
            title="@mirastone"
            description="18 public boards · 2.4k followers · weekly visual notes"
            actions={<Badge color="success">Curator</Badge>}
          >
            <Text color="muted">
              Collecting calm spaces, food stories, and practical inspiration boards.
            </Text>
          </Card>
        </ScreenSection>

        <ScreenSection title="Stats">
          <MetricCard
            label="Followers"
            value="2.4k"
            delta="+11%"
            deltaTone="success"
            description="Last 30 days"
          />
          <MetricCard label="Pins" value="684" description="Across public boards" />
          <MetricCard label="Boards" value="18" description="12 public · 6 private" />
        </ScreenSection>

        <ScreenSection title="Featured board">
          <MediaCard
            title="Warm studio corners"
            description="Small workspaces, shelves, and layered creative tools."
            imageSource={{
              uri: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
            }}
            imageLabel="Warm studio workspace with design objects"
            badges={<Badge color="primary">Featured board</Badge>}
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
