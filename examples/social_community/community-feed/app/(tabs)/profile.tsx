import { Avatar, Badge, Card, MetricCard, Screen, ScreenSection, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

export default function ProfileScreen() {
  return (
    <>
      <ExampleAppBar title="Profile" />
      <Screen>
        <ScreenSection
          title="Creator profile"
          description="A profile route composed from public ZORA exports."
          actions={<Avatar name="Ava Studio" tone="primary" />}
        >
          <Card
            title="Ava Studio"
            description="Community host · Product design · Mobile UX"
            actions={<Badge tone="success">Active</Badge>}
          >
            <Text tone="muted">1.8k followers · 243 saved posts · 32 active conversations.</Text>
          </Card>
        </ScreenSection>

        <ScreenSection title="Audience">
          <MetricCard
            label="Followers"
            value="1.8k"
            delta="+8%"
            deltaTone="success"
            description="Last 30 days"
          />
          <MetricCard label="Saved posts" value="243" description="Across public groups" />
          <MetricCard
            label="Replies"
            value="612"
            delta="+14"
            deltaTone="primary"
            description="This month"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
