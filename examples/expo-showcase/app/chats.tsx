import {
  Badge,
  ChatListItem,
  IconButton,
  Page,
  PageHeader,
  PageSection,
  Stack,
  Text,
} from '@ankhorage/zora';
import React from 'react';
import { ScrollView } from 'react-native';

const noop = () => undefined;

export function ChatsPage() {
  return (
    <ScrollView>
      <Page
        header={
          <PageHeader
            eyebrow="ChatListItem pattern"
            title="Chats"
            description="Reusable conversation preview rows composed in a plain Stack. ChatList, Collection, and FlatList wrappers are intentionally out of scope for this example."
          />
        }
      >
        <PageSection
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
              trailing={<Badge tone="success">Done</Badge>}
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
        </PageSection>

        <PageSection title="Usage note">
          <Text tone="muted" variant="bodySmall">
            ChatListItem owns one row. Real long chat lists should use an app-owned FlatList,
            pagination, refresh, and data loading strategy.
          </Text>
        </PageSection>
      </Page>
    </ScrollView>
  );
}
