import { Badge, ListSection, MetricCard, Notice, Page, PageHeader, PageSection } from '@ankhorage/zora';

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
    <Page
      header={
        <PageHeader
          title="Orders"
          description="Customer order history and fulfillment status."
          actions={<Badge tone="primary">1 active</Badge>}
        />
      }
    >
      <PageSection title="Order health">
        <MetricCard label="Open orders" value="1" description="Preparing shipment" />
        <MetricCard label="Delivered" value="12" delta="+3" deltaTone="success" description="Last 90 days" />
        <MetricCard label="Returns" value="0" description="No active return requests" />
      </PageSection>

      <ListSection title="Order history" description="Structured rows until ZORA has dedicated order cards." items={orderRows} />

      <PageSection title="Product note">
        <Notice
          title="Fulfillment is static"
          description="Tracking, refunds, returns, and notifications belong in later app/backend examples."
          tone="primary"
        />
      </PageSection>
    </Page>
  );
}
