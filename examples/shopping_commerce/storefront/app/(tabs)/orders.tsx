import { Badge, ListSection, MetricCard, Notice, Screen, ScreenSection } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const orderRows = [
  {
    title: 'Order #1042',
    description: 'Everyday ceramic set · preparing shipment',
    meta: 'CHF 89',
    variant: 'card' as const,
  },
  {
    title: 'Order #1038',
    description: 'Stoneware mug · delivered yesterday',
    meta: 'CHF 24',
    variant: 'card' as const,
  },
  {
    title: 'Order #1029',
    description: 'Oak serving board · delivered last week',
    meta: 'CHF 54',
    variant: 'card' as const,
  },
] as const;

export default function OrdersScreen() {
  return (
    <>
      <ExampleAppBar title="Orders" />
      <Screen>
        <ScreenSection title="Order health" actions={<Badge color="primary">1 active</Badge>}>
          <MetricCard label="Open orders" value="1" description="Preparing shipment" />
          <MetricCard
            label="Delivered"
            value="12"
            delta="+3"
            deltaColor="success"
            description="Last 90 days"
          />
          <MetricCard label="Returns" value="0" description="No active return requests" />
        </ScreenSection>

        <ListSection
          title="Order history"
          description="Structured rows until ZORA has dedicated order cards."
          items={orderRows}
        />

        <ScreenSection title="Product note">
          <Notice
            title="Fulfillment is static"
            description="Tracking, refunds, returns, and notifications belong in later app/backend examples."
            color="primary"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
