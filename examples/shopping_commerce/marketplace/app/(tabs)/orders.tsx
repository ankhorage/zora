import { Badge, ListSection, MetricCard, Notice, Screen, ScreenSection } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const orderRows = [
  {
    title: 'Walnut lounge chair',
    description: 'Pickup confirmed for Friday at 18:00.',
    meta: 'CHF 420',
    variant: 'card' as const,
  },
  {
    title: 'Ceramic dinner set',
    description: 'Seller accepted your offer. Payment pending.',
    meta: 'CHF 110',
    variant: 'card' as const,
  },
  {
    title: 'Studio camera kit',
    description: 'Message seller to arrange inspection.',
    meta: 'CHF 890',
    variant: 'card' as const,
  },
] as const;

export default function OrdersScreen() {
  return (
    <>
      <ExampleAppBar title="Orders" />
      <Screen>
        <ScreenSection title="Summary" actions={<Badge color="primary">3 active</Badge>}>
          <MetricCard label="Active orders" value="3" description="Purchases and offers" />
          <MetricCard
            label="Pending pickup"
            value="1"
            delta="Friday"
            deltaColor="primary"
            description="Next appointment"
          />
          <MetricCard label="Open offers" value="2" description="Awaiting seller reply" />
        </ScreenSection>

        <ListSection
          title="Order activity"
          description="Structured order rows until commerce-specific order cards exist."
          items={orderRows}
        />

        <ScreenSection title="Product note">
          <Notice
            title="Order lifecycle is static"
            description="Checkout, payment state, shipping, and dispute flows belong in later app/backend examples."
            color="primary"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
