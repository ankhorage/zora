import { Badge, ListSection, Screen, ScreenSection, SearchBar } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const categories = [
  {
    title: 'Furniture',
    description: 'Chairs, tables, shelves, lamps, and home office pieces.',
    meta: '1.2k listings',
    variant: 'card' as const,
  },
  {
    title: 'Electronics',
    description: 'Cameras, laptops, audio gear, and smart home devices.',
    meta: '840 listings',
    variant: 'card' as const,
  },
  {
    title: 'Home & kitchen',
    description: 'Dinnerware, textiles, storage, and small appliances.',
    meta: '620 listings',
    variant: 'card' as const,
  },
] as const;

export default function SearchScreen() {
  return (
    <>
      <ExampleAppBar title="Search" />
      <Screen>
        <ScreenSection
          title="Query"
          description="Search stays inside the ZORA component surface."
          actions={<Badge tone="neutral">Filters later</Badge>}
        >
          <SearchBar value="" placeholder="Search marketplace" />
        </ScreenSection>

        <ListSection
          title="Popular categories"
          description="Category browsing works with structured list rows for now."
          items={categories}
        />
      </Screen>
    </>
  );
}
