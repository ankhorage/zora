import { ListSection, MetricCard, Notice, Screen, ScreenSection } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const orderRows = [
  {
    title: 'Table 12 · tasting menu',
    description: 'Two tasting menus, one vegetarian, wine pairing pending.',
    meta: 'CHF 196',
    variant: 'card' as const,
  },
  {
    title: 'Takeaway · handmade pasta',
    description: 'Lemon tagliatelle and market salad, ready at 19:10.',
    meta: 'CHF 48',
    variant: 'card' as const,
  },
  {
    title: 'Gift voucher',
    description: 'Dinner voucher for two, sent by email.',
    meta: 'CHF 150',
    variant: 'card' as const,
  },
] as const;

export default function OrdersScreen() {
  return (
    <>
      <ExampleAppBar title="Orders" />
      <Screen>
        <ScreenSection title="Today" columns={{ base: 1, md: 3 }}>
          <MetricCard label="Open orders" value="2" description="Dining and takeaway" />
          <MetricCard
            label="Ready soon"
            value="19:10"
            delta="Takeaway"
            deltaTone="primary"
            description="Kitchen estimate"
          />
          <MetricCard label="Vouchers" value="1" description="Email delivery" />
        </ScreenSection>

        <ListSection
          title="Order activity"
          description="Order rows are static until restaurant-specific order patterns exist."
          items={orderRows}
        />

        <ScreenSection title="Operations note">
          <Notice
            title="No kitchen integration"
            description="Kitchen display, payment, voucher fulfillment, and live order status belong in later app/backend examples."
            tone="primary"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
