import { Badge, IconButton, PostCard, Screen, ScreenSection, Stack, Text } from '@ankhorage/zora';
import React from 'react';

import iconPng from '../assets/icon.png';

const noop = () => undefined;

export function PostsPage() {
  return (
    <Screen>
      <ScreenSection
        title="Stacked posts"
        description="Use Stack for short/static groups. App-owned FlatList or a future Collection can render the same PostCard for long feeds."
      >
        <Stack gap="m">
          <PostCard
            author={{
              name: 'Ada Lovelace',
              subtitle: '@ada · 2h',
              avatar: { name: 'Ada Lovelace', tone: 'primary' },
            }}
            headerAction={
              <IconButton
                icon={{ name: 'ellipsis-horizontal-outline' }}
                label="More post options"
              />
            }
            text="Working on a reusable social pattern for ZORA. The card owns the post anatomy; the surrounding screen owns list behavior."
            media={{ source: iconPng, label: 'ZORA showcase icon', aspectRatio: 16 / 9 }}
            actions={[
              {
                id: 'like',
                label: 'Like',
                icon: { name: 'heart-outline' },
                count: 24,
                onPress: noop,
              },
              {
                id: 'comment',
                label: 'Comment',
                icon: { name: 'chatbubble-outline' },
                count: 5,
                onPress: noop,
              },
              { id: 'share', label: 'Share', icon: { name: 'share-outline' }, onPress: noop },
            ]}
            comments={[
              {
                id: 'comment-1',
                author: {
                  name: 'Grace Hopper',
                  subtitle: '1h',
                  avatar: { name: 'Grace Hopper', tone: 'success' },
                },
                text: 'The boundary between card anatomy and feed rendering feels right.',
              },
            ]}
          />

          <PostCard
            compact
            tone="subtle"
            author={{
              name: 'Build system',
              subtitle: 'Today · release notes',
              avatar: { initials: 'CI', label: 'Build system', tone: 'neutral' },
            }}
            text="PostCard also supports compact density for system updates and notification-style content."
            actions={[
              {
                id: 'ack',
                label: 'Acknowledge',
                icon: { name: 'checkmark-outline' },
                onPress: noop,
              },
            ]}
            footer={
              <Text tone="subtle" variant="caption">
                Rendered as a standalone card inside Stack.
              </Text>
            }
          />

          <PostCard
            author={{
              name: 'Maya Chen',
              subtitle: 'Product design · Yesterday',
              avatar: { name: 'Maya Chen', tone: 'warning' },
            }}
            text="Custom media slots stay possible without making PostCard own uploads, storage, or provider logic."
            media={{
              label: 'Custom media placeholder',
              children: (
                <Stack gap="s">
                  <Badge tone="primary">Custom media slot</Badge>
                  <Text tone="muted" variant="bodySmall">
                    Consumers can render any ZORA-safe media preview here.
                  </Text>
                </Stack>
              ),
            }}
            actions={[
              { id: 'like', label: 'Like', icon: { name: 'heart-outline' }, onPress: noop },
              {
                id: 'comment',
                label: 'Comment',
                icon: { name: 'chatbubble-outline' },
                onPress: noop,
              },
            ]}
          />
        </Stack>
      </ScreenSection>
    </Screen>
  );
}
