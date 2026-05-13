import { Badge, ListSection, MediaCard, Page, PageHeader, PageSection, SearchBar, Text } from '@ankhorage/zora';

const menuRows = [
  {
    title: 'Handmade lemon tagliatelle',
    description: 'Brown butter, asparagus, herbs, and aged parmesan.',
    meta: 'CHF 32',
    variant: 'card' as const,
  },
  {
    title: 'Charred market vegetables',
    description: 'Seasonal vegetables, smoked yoghurt, and toasted seeds.',
    meta: 'CHF 24',
    variant: 'card' as const,
  },
  {
    title: 'Lemon olive oil tart',
    description: 'Citrus curd, olive oil crust, and whipped mascarpone.',
    meta: 'CHF 14',
    variant: 'card' as const,
  },
] as const;

export default function MenuScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Menu"
          description="Seasonal dishes, tasting menus, dietary notes, and specials."
          actions={<Badge tone="primary">Seasonal</Badge>}
        />
      }
    >
      <PageSection title="Search" description="Search dishes and dietary options.">
        <SearchBar value="" placeholder="Search menu" />
      </PageSection>

      <PageSection title="Featured dish" description="A rich menu item using the existing media card pattern.">
        <MediaCard
          title="Burrata with spring peas"
          description="CHF 21 · mint, lemon zest, toasted focaccia."
          imageSource={{
            uri: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
          }}
          imageLabel="Fresh pasta and burrata dish"
          badges={<Badge tone="success">Vegetarian</Badge>}
        />
      </PageSection>

      <ListSection title="Dinner menu" description="Structured menu rows until ZORA has dedicated menu item cards." items={menuRows} />
      <Text tone="muted">Restaurant examples reveal a future need for MenuItem, DietaryBadge, and PriceRow patterns.</Text>
    </Page>
  );
}
