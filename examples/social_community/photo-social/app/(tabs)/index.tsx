import {
  AvatarGroup,
  Badge,
  Button,
  MediaCard,
  Page,
  PageHeader,
  PageSection,
  PostCard,
  Text,
} from '@ankhorage/zora';

const featuredPost = {
  author: {
    name: 'Lina Brooks',
    subtitle: 'Street color study · 8 min ago',
    avatar: { name: 'Lina Brooks', tone: 'primary' as const },
  },
  text: 'Golden hour does most of the work, but framing the negative space made the whole carousel feel calmer.',
  media: {
    source: {
      uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    },
    label: 'Warm city terrace at golden hour',
    aspectRatio: 4 / 5,
  },
  actions: [
    { id: 'like', label: 'Like', icon: { name: 'heart-outline' }, count: '2.4k' },
    { id: 'comment', label: 'Comment', icon: { name: 'chatbubble-outline' }, count: '184' },
    { id: 'share', label: 'Share', icon: { name: 'paper-plane-outline' } },
  ],
} as const;

export default function HomeScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Photo Social"
          description="A visual social app built with real Expo Router tabs and ZORA-only UI."
          actions={<Button leadingIcon={{ name: 'camera-outline' }}>Capture</Button>}
        />
      }
    >
      <ScreenSection
        title="Stories"
        description="Avatar groups and badges give the feed a social rhythm without custom styles."
        actions={<Badge tone="success">Live feed</Badge>}
      >
        <MediaCard
          title="Weekend makers"
          description="New visual notes from people you follow."
          imageSource={{
            uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
          }}
          imageLabel="People at a creative event"
          badges={<Badge tone="primary">12 updates</Badge>}
          footer={
            <AvatarGroup
              items={[
                { id: 'lina', name: 'Lina Brooks' },
                { id: 'marco', name: 'Marco Silva', tone: 'success' },
                { id: 'aya', name: 'Aya Novak', tone: 'warning' },
              ]}
            />
          }
        />
      </ScreenSection>

      <ScreenSection
        title="Following"
        description="A realistic image-first feed using the ZORA PostCard pattern."
      >
        <PostCard {...featuredPost} />
        <Text tone="muted">
          The first missing ZORA gap will probably be a dedicated visual grid/masonry pattern.
        </Text>
      </ScreenSection>
    </Page>
  );
}
