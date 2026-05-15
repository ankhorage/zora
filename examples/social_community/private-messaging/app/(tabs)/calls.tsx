import React from 'react';

import {
  Badge,
  ChatListItem,
  Divider,
  Icon,
  Screen,
  ScreenSection,
  SearchBar,
  Stack,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const calls = [
  {
    title: 'Mia Chen',
    preview: 'Missed voice call',
    meta: 'Today · 09:12',
    avatar: { name: 'Mia Chen', tone: 'primary' as const },
  },
  {
    title: 'Noah Keller',
    preview: 'Outgoing video call',
    meta: 'Yesterday · 18:44',
    avatar: { name: 'Noah Keller', tone: 'success' as const },
  },
  {
    title: 'Lea Meyer',
    preview: 'Incoming voice call',
    meta: 'Monday · 14:05',
    avatar: { name: 'Lea Meyer', tone: 'warning' as const },
  },
  {
    title: 'Product Crew',
    preview: 'Missed group voice call',
    meta: 'Sunday · 20:17',
    avatar: { name: 'Product Crew', tone: 'neutral' as const },
  },
  {
    title: 'Aline Roth',
    preview: 'Outgoing voice call',
    meta: 'Friday · 11:28',
    avatar: { name: 'Aline Roth', tone: 'primary' as const },
  },
] as const;

function CallList({ children }: { children: React.ReactNode }) {
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

export default function CallsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Calls"
        subtitle="Recent voice and video interactions for a private messaging app."
        actions={<Badge tone="neutral">Static</Badge>}
      />
      <Screen>
        <ScreenSection>
          <SearchBar value="" placeholder="Search calls" />
        </ScreenSection>

        <CallList>
          {calls.map((call) => (
            <ChatListItem
              key={call.title}
              {...call}
              trailing={<Icon name="call-outline" size={22} />}
            />
          ))}
        </CallList>
      </Screen>
    </>
  );
}
