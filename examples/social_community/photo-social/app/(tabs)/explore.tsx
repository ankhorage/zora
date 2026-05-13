import { Badge, MediaCard, Page, PageHeader, PageSection, SearchBar, Text } from '@ankhorage/zora';

const collections = [
  {
    title: 'Minimal interiors',
    description: 'Soft light, warm neutrals, calm composition.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Minimal living room with warm light',
  },
  {
    title: 'City textures',
    description: 'Concrete, signage, windows, and layered street details.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'City buildings and street texture',
  },
  {
    title: 'Food stories',
    description: 'Tables, markets, recipes, and small restaurant moments.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Colorful food table',
  },
] as const;

export default function ExploreScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Explore"
          description="Discover visual collections and creator-led image themes."
          actions={<Badge tone="primary">Trending</Badge>}
        />
      }
    >
      <ScreenSection
        title="Search"
        description="The search control is part of the ZORA component surface."
      >
        <SearchBar value="" placeholder="Search creators, places, styles" />
      </ScreenSection>

      <ScreenSection
        title="Collections"
        description="A simple grid-like flow using existing ZORA cards."
      >
        {collections.map((collection) => (
          <MediaCard
            key={collection.title}
            {...collection}
            badges={<Badge tone="neutral">Featured</Badge>}
          />
        ))}
        <Text tone="muted">
          A richer visual discovery template should probably introduce a dedicated Wall/Grid pattern
          later.
        </Text>
      </ScreenSection>
    </Page>
  );
}
