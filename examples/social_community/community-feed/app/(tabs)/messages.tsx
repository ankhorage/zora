import {
  AppBar,
  Avatar,
  Badge,
  ListSection,
  Panel,
  Screen,
  ScreenSection,
  Text,
} from '@ankhorage/zora';

const conversations = [
  {
    title: 'Mia Chen',
    description: 'Sent feedback on the onboarding flow two minutes ago.',
    meta: 'Now',
    leading: <Avatar name="Mia Chen" tone="primary" />,
    variant: 'card' as const,
  },
  {
    title: 'Noah Keller',
    description: 'Shared the event checklist for Friday.',
    meta: '18m',
    leading: <Avatar name="Noah Keller" tone="success" />,
    variant: 'card' as const,
  },
  {
    title: 'Lea Meyer',
    description: 'Asked for a second review on the profile card.',
    meta: '1h',
    leading: <Avatar name="Lea Meyer" tone="warning" />,
    variant: 'card' as const,
  },
] as const;

export default function MessagesScreen() {
  return (
    <>
      <AppBar
        title="Messages"
        subtitle="A lightweight social inbox screen for the starter app."
        actions={<Badge tone="primary">3 unread</Badge>}
      />
      <Screen>
        <ScreenSection
          title="Pinned"
          description="The first message preview uses a reusable ZORA panel."
        >
          <Panel title="Mia Chen" description="Sent feedback on the onboarding flow two minutes ago.">
            <Text tone="muted">
              The next iteration can replace this with a dedicated ChatList pattern when the app needs
              richer message states.
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
