import {
  Badge,
  ChatListItem,
  IconButton,
  MessageBubble,
  Screen,
  ScreenSection,
  Stack,
  Text,
} from '@ankhorage/zora';
import React from 'react';

const noop = () => undefined;

export function ChatsPage() {
  return (
    <Screen>
      <ScreenSection
        title="Stacked conversation previews"
        description="Use Stack for short/static groups. App-owned FlatList or a future Collection can render the same ChatListItem for long chat lists."
      >
        <Stack gap="none">
          <ChatListItem
            accessibilityLabel="Ada Lovelace, unread, 3 new messages, Can you review the new PostCard API?, 2 minutes ago"
            avatar={{ name: 'Ada Lovelace', tone: 'primary' }}
            preview="Can you review the new PostCard API?"
            timestamp="2m"
            title="Ada Lovelace"
            unread
            unreadCount={3}
            onPress={noop}
          />

          <ChatListItem
            avatar={{ name: 'Grace Hopper', tone: 'success' }}
            preview="The build is green."
            timestamp="1h"
            title="Grace Hopper"
            onPress={noop}
          />

          <ChatListItem
            avatar={{ initials: 'CI', label: 'Build system', tone: 'neutral' }}
            compact
            meta="Release automation"
            preview="Version packages completed for @ankhorage/zora."
            timestamp="Today"
            title="Build system"
            trailing={<Badge color="success">Done</Badge>}
          />

          <ChatListItem
            avatar={{ name: 'Maya Chen', tone: 'warning' }}
            preview="Let's revisit the mobile layout before the next pass."
            selected
            timestamp="Yesterday"
            title="Maya Chen"
            trailing={
              <IconButton
                icon={{ name: 'ellipsis-horizontal-outline' }}
                label="More chat actions"
              />
            }
            onPress={noop}
          />

          <ChatListItem
            avatar={{ name: 'Archived thread', tone: 'neutral' }}
            disabled
            meta="Archived"
            preview="This row shows the disabled state."
            timestamp="Mon"
            title="Archived thread"
          />
        </Stack>
      </ScreenSection>

      <ScreenSection
        title="Stacked message bubbles"
        description="MessageBubble owns one message. The surrounding screen owns scrolling, keyboard handling, realtime updates, pagination, and composer behavior."
      >
        <Stack gap="s">
          <MessageBubble
            author={{
              name: 'Ada Lovelace',
              avatar: { name: 'Ada Lovelace', tone: 'primary' },
            }}
            direction="incoming"
            text="Can you review the new ChatListItem API?"
            timestamp="10:41"
            onPress={noop}
          />

          <MessageBubble
            direction="outgoing"
            status="read"
            text="Yes, the row/list boundary looks correct. MessageBubble should stay independent from the thread renderer too."
            timestamp="10:42"
            onPress={noop}
          />

          <MessageBubble direction="system" compact text="Today" />

          <MessageBubble
            author={{
              name: 'Grace Hopper',
              avatar: { name: 'Grace Hopper', tone: 'success' },
            }}
            direction="incoming"
            meta="Edited"
            text="Agreed. The bubble can render inside Stack now and inside an app-owned FlatList later."
            timestamp="10:44"
          />

          <MessageBubble
            direction="outgoing"
            selected
            status="delivered"
            text="Selected state is useful for authoring previews and future message selection work."
            timestamp="10:45"
          />

          <MessageBubble
            compact
            direction="outgoing"
            disabled
            status="failed"
            text="Disabled and failed states can be previewed without adding delivery logic."
            timestamp="10:46"
          />
        </Stack>
      </ScreenSection>

      <ScreenSection title="Usage note">
        <Text color="muted" variant="bodySmall">
          ChatListItem and MessageBubble own presentation only. Real long chat lists should use an
          app-owned FlatList, pagination, refresh, keyboard handling, and data loading strategy.
        </Text>
      </ScreenSection>
    </Screen>
  );
}
