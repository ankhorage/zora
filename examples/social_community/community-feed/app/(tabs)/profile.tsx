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
          actions={<Avatar name="Ava Studio" color="primary" />}
        >
          <Card
            title="Ava Studio"
            description="Community host · Product design · Mobile UX"
            actions={<Badge color="success">Active</Badge>}
          >
            <Text emphasis="muted">
              1.8k followers · 243 saved posts · 32 active conversations.
            </Text>
          </Card>
        </ScreenSection>

        <ScreenSection title="Audience">
          <MetricCard
            label="Followers"
            value="1.8k"
            delta="+8%"
            deltaColor="success"
            description="Last 30 days"
          />
          <MetricCard label="Saved posts" value="243" description="Across public groups" />
          <MetricCard
            label="Replies"
            value="612"
            delta="+14"
            deltaColor="primary"
            description="This month"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
