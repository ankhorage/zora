import { Badge, Button, MediaCard, Notice, Page, PageHeader, PageSection, SearchBar, Text } from '@ankhorage/zora';

const pins = [
  {
    title: 'Warm studio corners',
    description: 'Soft light, ceramic objects, and compact workspaces.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Warm studio workspace with design objects',
  },
  {
    title: 'Quiet travel notes',
    description: 'Muted streets, small hotels, and local breakfast tables.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Quiet landscape road during travel',
  },
  {
    title: 'Editorial food boards',
    description: 'Market colors, seasonal plates, and restaurant details.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Editorial food table with colorful ingredients',
  },
] as const;

export default function DiscoverScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Visual discovery"
          description="A Pinterest-style starter built with real Expo Router tabs and ZORA-only UI."
          actions={<Button leadingIcon={{ name: 'add-circle-outline' }}>Create board</Button>}
        />
      }
    >
      <PageSection title="Search" description="Visual discovery starts with a broad idea or mood.">
        <SearchBar value="" placeholder="Search ideas, boards, products, places" />
      </PageSection>

      <PageSection
        title="For you"
        description="Existing ZORA media cards stand in for a future Wall/Grid pattern."
        actions={<Badge tone="primary">Personalized</Badge>}
      >
        {pins.map((pin) => (
          <MediaCard key={pin.title} {...pin} badges={<Badge tone="neutral">Pin</Badge>} />
        ))}
      </PageSection>

      <PageSection title="ZORA pressure point">
        <Notice
          title="Needs a visual wall pattern"
          description="The app works, but a Pinterest-style template should eventually use a dedicated Wall/Grid or Masonry pattern instead of a simple card flow."
          tone="warning"
        />
        <Text tone="muted">This example captures the product need without adding local layout tricks.</Text>
      </PageSection>
    </Page>
  );
}
