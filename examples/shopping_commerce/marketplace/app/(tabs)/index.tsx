import { Badge, MediaCard, Notice, Screen, ScreenSection, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const listings = [
  {
    title: 'Walnut lounge chair',
    description: 'CHF 420 · Zürich Kreis 4 · gently used',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Walnut lounge chair in a bright room',
  },
  {
    title: 'Studio camera kit',
    description: 'CHF 890 · Basel · includes lens and travel case',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Camera and lens on a table',
  },
  {
    title: 'Ceramic dinner set',
    description: 'CHF 120 · Bern · eight plates and bowls',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Ceramic objects on a shelf',
  },
] as const;

export default function BrowseScreen() {
  return (
    <>
      <ExampleAppBar
        title="Browse"
        subtitle="Recommended marketplace listings from nearby sellers."
        actions={<Badge color="primary">Nearby</Badge>}
      />
      <Screen>
        <ScreenSection
          title="Recommended"
          description="Existing ZORA media cards stand in for future product listing cards."
        >
          {listings.map((listing) => (
            <MediaCard
              key={listing.title}
              {...listing}
              badges={<Badge color="success">Available</Badge>}
            />
          ))}
        </ScreenSection>

        <ScreenSection title="ZORA pressure point">
          <Notice
            title="Needs commerce-specific cards"
            description="A real marketplace should have ProductCard/ProductGrid patterns for price, seller, distance, condition, and favorite state."
            color="warning"
          />
          <Text color="muted">
            This example records the product need without adding local card wrappers.
          </Text>
        </ScreenSection>
      </Screen>
    </>
  );
}
