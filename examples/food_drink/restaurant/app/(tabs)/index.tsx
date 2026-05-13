import { AvatarGroup, Badge, Button, MediaCard, Notice, Page, PageHeader, PageSection, Text } from '@ankhorage/zora';

export default function HomeScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Casa Verde"
          description="A neighborhood restaurant starter for menu discovery, reservations, orders, and guest profile."
          actions={<Button leadingIcon={{ name: 'calendar-outline' }}>Reserve</Button>}
        />
      }
    >
      <PageSection
        title="Tonight's feature"
        description="Restaurant home content composed from ZORA media cards and badges."
        actions={<Badge tone="success">Open now</Badge>}
      >
        <MediaCard
          title="Spring tasting menu"
          description="CHF 78 · asparagus, handmade pasta, lemon tart, and optional wine pairing."
          imageSource={{
            uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
          }}
          imageLabel="Restaurant table with plated dinner"
          badges={<Badge tone="primary">Chef's pick</Badge>}
          footer={
            <AvatarGroup
              items={[
                { id: 'chef', name: 'Elena Rossi', tone: 'primary' },
                { id: 'host', name: 'Marco Frei', tone: 'success' },
                { id: 'sommelier', name: 'Lina Keller', tone: 'warning' },
              ]}
            />
          }
        />
      </PageSection>

      <PageSection title="Guest note">
        <Notice
          title="Reservations available"
          description="Tables are open from 18:00. Booking persistence is intentionally outside this static UI example."
          tone="primary"
        />
        <Text tone="muted">A dedicated RestaurantHero or MenuFeature pattern would make this app stronger later.</Text>
      </PageSection>
    </Page>
  );
}
