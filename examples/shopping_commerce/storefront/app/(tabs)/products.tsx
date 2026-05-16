import { Badge, MediaCard, Screen, ScreenSection, SearchBar, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

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
    <>
      <ExampleAppBar title="Products" />
      <Screen>
        <ScreenSection
          title="Search"
          description="Filtering is static for now, but the UI surface is real."
          actions={<Badge color="primary">42 items</Badge>}
        >
          <SearchBar
            onValueChange={() => {
              /* no-op */
            }}
            value=""
            placeholder="Search products"
          />
        </ScreenSection>

        <ScreenSection
          title="Catalog"
          description="Media cards stand in for future ProductCard/ProductGrid patterns."
        >
          {products.map((product) => (
            <MediaCard
              key={product.title}
              {...product}
              badges={<Badge color="success">Available</Badge>}
            />
          ))}
          <Text emphasis="muted">
            Storefront needs ProductCard, ProductGrid, price, sale, and inventory-aware patterns
            later.
          </Text>
        </ScreenSection>
      </Screen>
    </>
  );
}
