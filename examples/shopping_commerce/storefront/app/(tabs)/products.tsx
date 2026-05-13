import { Badge, MediaCard, Page, PageHeader, PageSection, SearchBar, Text } from '@ankhorage/zora';

const products = [
  {
    title: 'Ceramic breakfast bowl',
    description: 'CHF 28 · sand glaze · ships in 2 days',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Ceramic bowl on a table',
  },
  {
    title: 'Oak serving board',
    description: 'CHF 54 · small batch · FSC oak',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1606914469633-bd39206ea739?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Wooden serving board with food',
  },
  {
    title: 'Stoneware mug',
    description: 'CHF 24 · matte finish · four colors',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Stoneware mug with coffee',
  },
] as const;

export default function ProductsScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Products"
          description="A catalog route for browsing product cards and collections."
          actions={<Badge tone="primary">42 items</Badge>}
        />
      }
    >
      <PageSection
        title="Search"
        description="Filtering is static for now, but the UI surface is real."
      >
        <SearchBar value="" placeholder="Search products" />
      </PageSection>

      <PageSection
        title="Catalog"
        description="Media cards stand in for future ProductCard/ProductGrid patterns."
      >
        {products.map((product) => (
          <MediaCard
            key={product.title}
            {...product}
            badges={<Badge tone="success">Available</Badge>}
          />
        ))}
        <Text tone="muted">
          Storefront needs ProductCard, ProductGrid, price, sale, and inventory-aware patterns
          later.
        </Text>
      </PageSection>
    </Page>
  );
}
