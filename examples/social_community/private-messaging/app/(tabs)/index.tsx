import React from 'react';

import {
  Button,
  ChatListItem,
  Divider,
  Screen,
  ScreenSection,
  SearchBar,
  Stack,
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
  {
    title: 'Product Crew',
    preview: 'Sam: I moved the launch checklist into the shared board.',
    meta: '6 members active',
    timestamp: 'Yesterday',
    avatar: { name: 'Product Crew', tone: 'neutral' as const },
    unread: true,
    unreadCount: '5',
  },
  {
    title: 'Noah Keller',
    preview: 'Let us keep the icon-only variant for compact toolbars.',
    timestamp: 'Mon',
    avatar: { name: 'Noah Keller', tone: 'success' as const },
  },
  {
    title: 'Aline Roth',
    preview: 'Two reports mention the same notification edge case.',
    timestamp: 'Mon',
    avatar: { name: 'Aline Roth', tone: 'primary' as const },
  },
  {
    title: 'Jonas Weber',
    preview: 'The build is green again.',
    timestamp: 'Sun',
    avatar: { name: 'Jonas Weber', tone: 'neutral' as const },
  },
  {
    title: 'Research Notes',
    preview: 'Mira: I added the transcript summary and the open questions.',
    meta: '3 members active',
    timestamp: 'Sat',
    avatar: { name: 'Research Notes', tone: 'warning' as const },
  },
  {
    title: 'Anna Frei',
    preview: 'Photo',
    timestamp: 'Fri',
    avatar: { name: 'Anna Frei', tone: 'success' as const },
  },
  {
    title: 'Launch Room',
    preview: 'Tom: Final copy pass is ready for review.',
    meta: '9 members active',
    timestamp: 'Thu',
    avatar: { name: 'Launch Room', tone: 'primary' as const },
  },
] as const;

function ChatList({ children }: { children: React.ReactNode }) {
  const rows = React.Children.toArray(children);

  return (
    <Stack gap="none" style={{ minWidth: 0, width: '100%' }}>
      {rows.map((row, index) => (
        <React.Fragment key={`${index}`}>
          {index > 0 ? <Divider /> : null}
          {row}
        </React.Fragment>
      ))}
    </Stack>
  );
}

export default function ChatsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Chats"
        subtitle="A WhatsApp-style private messaging starter built with real Expo Router tabs."
        actions={<Button leadingIcon={{ name: 'create-outline' }}>New chat</Button>}
      />
      <Screen>
        <ScreenSection>
          <SearchBar value="" placeholder="Search chats" />
        </ScreenSection>

        <ChatList>
          {chats.map((chat) => (
            <ChatListItem key={chat.title} {...chat} />
          ))}
        </ChatList>
      </Screen>
    </>
  );
}
