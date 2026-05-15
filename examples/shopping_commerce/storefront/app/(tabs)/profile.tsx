import {
  Avatar,
  Badge,
  Card,
  ListSection,
  MetricCard,
  Screen,
  ScreenSection,
  Text,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const accountRows = [
  {
    title: 'Shipping addresses',
    description: 'Home, studio, and gift recipient addresses.',
    meta: '3 saved',
    variant: 'card' as const,
  },
  {
    title: 'Payment methods',
    description: 'Cards and invoices are placeholders in this static example.',
    meta: '2 saved',
    variant: 'card' as const,
  },
  {
    title: 'Wishlist',
    description: 'Saved products and back-in-stock alerts.',
    meta: '18 items',
    variant: 'card' as const,
  },
] as const;

export default function ProfileScreen() {
  return (
    <>
      <ExampleAppBar title="Customer profile" />
      <Screen>
        <ScreenSection title="Customer card" actions={<Avatar name="Nora Frei" color="primary" />}>
          <Card
            title="Nora Frei"
            description="Studio customer · Zürich · member since 2024"
            actions={<Badge color="success">Gold member</Badge>}
          >
            <Text color="muted">
              Prefers natural materials, ceramic sets, and quiet tableware collections.
            </Text>
          </Card>
        </ScreenSection>

        <ScreenSection title="Loyalty">
          <MetricCard
            label="Points"
            value="4,280"
            delta="+320"
            deltaTone="success"
            description="This month"
          />
          <MetricCard label="Orders" value="13" description="Lifetime purchases" />
          <MetricCard label="Wishlist" value="18" description="Saved products" />
        </ScreenSection>

        <ListSection
          title="Account"
          description="Storefront account settings as structured ZORA rows."
          items={accountRows}
        />
      </Screen>
    </>
  );
}
