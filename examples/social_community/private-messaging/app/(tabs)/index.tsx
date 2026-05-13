import {
  Badge,
  Button,
  Card,
  ChatListItem,
  Screen,
  ScreenSection,
  SearchBar,
  Text,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const chats = [
  {
    title: 'Mia Chen',
    preview: 'Can you send the final onboarding frames?',
    timestamp: '09:42',
    avatar: { name: 'Mia Chen', tone: 'primary' as const },
    unread: true,
    unreadCount: '2',
  },
  {
    title: 'Design Systems Circle',
    preview: 'Noah: The button spacing looks much calmer now.',
    meta: '12 members active',
    timestamp: '08:18',
    avatar: { name: 'Design Systems Circle', tone: 'success' as const },
  },
  {
    title: 'Lea Meyer',
    preview: 'Voice note · 0:24',
    timestamp: 'Yesterday',
    avatar: { name: 'Lea Meyer', tone: 'warning' as const },
  },
] as const;

export default function ChatsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Chats"
        subtitle="A WhatsApp-style private messaging starter built with real Expo Router tabs."
        actions={<Button leadingIcon={{ name: 'create-outline' }}>New chat</Button>}
      />
      <Screen>
        <ScreenSection
          title="Search"
          description="Search is a first-class ZORA component, not local input glue."
        >
          <SearchBar value="" placeholder="Search chats" />
        </ScreenSection>

        <ScreenSection
          title="Pinned"
          description="ChatListItem carries the main inbox interaction shape."
          actions={<Badge tone="primary">3 chats</Badge>}
        >
          {chats.map((chat) => (
            <ChatListItem key={chat.title} {...chat} />
          ))}
        </ScreenSection>

        <ScreenSection title="Messaging gap">
          <Card
            title="Next ZORA pressure point"
            description="A full ChatScreen pattern should handle message bubbles, composer, date separators, and attachments."
            actions={<Badge tone="warning">Follow-up</Badge>}
            tone="subtle"
          >
            <Text tone="muted">
              This example intentionally stays static until ZORA owns the missing chat primitives.
            </Text>
          </Card>
        </ScreenSection>
      </Screen>
    </>
  );
}
