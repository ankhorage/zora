import {
  Badge,
  Button,
  Card,
  FormField,
  ImageUploadField,
  Input,
  Notice,
  Screen,
  ScreenSection,
  Textarea,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

export default function SellScreen() {
  return (
    <>
      <ExampleAppBar title="Sell" />
      <Screen>
        <ScreenSection
          title="Photos"
          description="Upload is represented by the ZORA image upload field."
          actions={<Button>Publish</Button>}
        >
          <ImageUploadField
            label="Listing photos"
            description="Add clear photos from multiple angles."
            onChange={() => undefined}
            onPick={() => Promise.resolve(null)}
            value={null}
          />
        </ScreenSection>

        <ScreenSection
          title="Details"
          description="A minimal listing form without local style objects."
        >
          <FormField label="Title">
            <Input placeholder="Walnut lounge chair" />
          </FormField>
          <FormField label="Price">
            <Input placeholder="CHF 420" />
          </FormField>
          <Textarea placeholder="Describe condition, pickup details, and what is included..." />
        </ScreenSection>

        <ScreenSection title="Readiness">
          <Card
            title="Draft listing"
            description="Add photos, price, and pickup location before publishing."
            actions={<Badge color="warning">Draft</Badge>}
            tone="subtle"
          />
          <Notice
            title="Static commerce example"
            description="Payments, checkout, and seller verification belong outside this ZORA UI example."
            color="primary"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
