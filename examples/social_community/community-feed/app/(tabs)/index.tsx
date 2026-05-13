import { Badge, Button, Card, PostCard, Screen, ScreenSection, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const posts = [
  {
    id: 'post-1',
    author: {
      name: 'Mia Chen',
      subtitle: 'Design Systems Circle · 12 min ago',
      avatar: { name: 'Mia Chen', tone: 'primary' as const },
    },
    text: 'We just published the first critique notes for the mobile composer. The biggest win: fewer controls, clearer rhythm, and better preview states.',
    actions: [
      { id: 'like', label: 'Like', icon: { name: 'heart-outline' }, count: '48' },
      { id: 'comment', label: 'Comment', icon: { name: 'chatbubble-outline' }, count: '12' },
      { id: 'share', label: 'Share', icon: { name: 'share-outline' } },
    ],
  },
  {
    id: 'post-2',
    author: {
      name: 'Noah Keller',
      subtitle: 'Community Ops · 28 min ago',
      avatar: { name: 'Noah Keller', tone: 'success' as const },
    },
    text: 'Friday meetup is confirmed. Bring one screen that feels almost right but still needs a product pass.',
    actions: [
      { id: 'like', label: 'Like', icon: { name: 'heart-outline' }, count: '31' },
      { id: 'comment', label: 'Comment', icon: { name: 'chatbubble-outline' }, count: '7' },
    ],
  },
] as const;

export default function FeedScreen() {
  return (
    <>
      <ExampleAppBar title="Community feed" />
      <Screen>
        <ScreenSection
          title="Today"
          description="The example uses ZORA components only: no StyleSheet, no Surface imports, no fake tabs."
          actions={<Button leadingIcon={{ name: 'add-circle-outline' }}>New post</Button>}
        >
          {posts.map((post) => (
            <PostCard key={post.id} author={post.author} text={post.text} actions={post.actions} />
          ))}
        </ScreenSection>

        <ScreenSection
          title="Community pulse"
          description="Quick summary cards compose the rest of the feed."
          actions={<Badge tone="success">Real route</Badge>}
        >
          <Card
            title="Design critique room"
            description="14 people are reviewing mobile profile cards right now."
            actions={<Button emphasis="outline">Join</Button>}
          >
            <Text tone="muted">Best fit for later: live rooms and group activity patterns.</Text>
          </Card>
          <Card
            title="Review queue"
            description="3 replies need a decision before the weekly digest goes out."
            actions={<Badge tone="warning">Needs review</Badge>}
            tone="subtle"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
