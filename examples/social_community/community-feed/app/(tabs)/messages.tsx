import { Avatar, Badge, ListSection, Panel, Screen, ScreenSection, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const conversations = [
  {
    title: 'Mia Chen',
    description: 'Sent feedback on the onboarding flow two minutes ago.',
    meta: 'Now',
    leading: <Avatar name="Mia Chen" color="primary" />,
    variant: 'card' as const,
  },
  {
    title: 'Noah Keller',
    description: 'Shared the event checklist for Friday.',
    meta: '18m',
    leading: <Avatar name="Noah Keller" color="success" />,
    variant: 'card' as const,
  },
  {
    title: 'Lea Meyer',
    description: 'Asked for a second review on the profile card.',
    meta: '1h',
    leading: <Avatar name="Lea Meyer" color="warning" />,
    variant: 'card' as const,
  },
] as const;

export default function MessagesScreen() {
  return (
    <>
      <ExampleAppBar title="Messages" />
      <Screen>
        <ScreenSection
          title="Pinned"
          description="The first message preview uses a reusable ZORA panel."
          actions={<Badge color="primary">3 unread</Badge>}
        >
          <Panel
            title="Mia Chen"
            description="Sent feedback on the onboarding flow two minutes ago."
          >
            <Text emphasis="muted">
              The next iteration can replace this with a dedicated ChatList pattern when the app
              needs richer message states.
            </Text>
          </Panel>
        </ScreenSection>

        <ListSection
          title="Inbox"
          description="Real list rows, not fake navigation state."
          items={conversations}
        />
      </Screen>
    </>
  );
}
