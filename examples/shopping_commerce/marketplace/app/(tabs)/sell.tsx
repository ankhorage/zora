import {
  AppBar,
  Badge,
  Button,
  Card,
  ImageUploadField,
  Input,
  Notice,
  Screen,
  ScreenSection,
  Textarea,
} from '@ankhorage/zora';

export default function SellScreen() {
  return (
    <>
      <AppBar
        title="Sell"
        subtitle="Create a listing with structured ZORA form and media components."
        actions={<Button>Publish</Button>}
      />
      <Screen>
        <ScreenSection
          title="Photos"
          description="Upload is represented by the ZORA image upload field."
        >
          <ImageUploadField
            label="Listing photos"
            description="Add clear photos from multiple angles."
            actionLabel="Choose photos"
          />
        </ScreenSection>

        <ScreenSection
          title="Details"
          description="A minimal listing form without local style objects."
        >
          <Input label="Title" placeholder="Walnut lounge chair" />
          <Input label="Price" placeholder="CHF 420" />
          <Textarea placeholder="Describe condition, pickup details, and what is included..." />
        </ScreenSection>

        <ScreenSection title="Readiness">
          <Card
            title="Draft listing"
            description="Add photos, price, and pickup location before publishing."
            actions={<Badge tone="warning">Draft</Badge>}
            tone="subtle"
          />
          <Notice
            title="Static commerce example"
            description="Payments, checkout, and seller verification belong outside this ZORA UI example."
            tone="primary"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
