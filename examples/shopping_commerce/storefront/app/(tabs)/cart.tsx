import {
  AppBar,
  Badge,
  Button,
  Card,
  ListSection,
  Notice,
  Screen,
  ScreenSection,
} from '@ankhorage/zora';

const cartRows = [
  {
    title: 'Everyday ceramic set',
    description: 'Quantity 1 · sand glaze',
    meta: 'CHF 89',
    variant: 'card' as const,
  },
  {
    title: 'Linen table bundle',
    description: 'Quantity 1 · natural linen',
    meta: 'CHF 64',
    variant: 'card' as const,
  },
  {
    title: 'Stoneware mug',
    description: 'Quantity 2 · matte cream',
    meta: 'CHF 48',
    variant: 'card' as const,
  },
] as const;

export default function CartScreen() {
  return (
    <>
      <AppBar
        title="Cart"
        subtitle="Selected products, order summary, and checkout placeholder."
        actions={<Button>Checkout</Button>}
      />
      <Screen>
        <ListSection
          title="Items"
          description="Cart rows use structured ZORA list semantics."
          items={cartRows}
        />

        <ScreenSection title="Summary">
          <Card
            title="Order total"
            description="CHF 201 · shipping calculated later"
            actions={<Badge tone="primary">3 items</Badge>}
          />
          <Notice
            title="Checkout is out of scope"
            description="The UI is static. Payments, taxes, shipping, and inventory reservation belong in app/backend examples later."
            tone="primary"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
