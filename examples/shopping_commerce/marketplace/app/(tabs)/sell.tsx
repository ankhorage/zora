import {
  Badge,
  Button,
  Card,
  Field,
  Form,
  Screen,
  ScreenSection,
  TextInput,
  Uploader,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../../src/components/example-app-bar';

export default function SellScreen() {
  return (
    <>
      <ExampleAppBar title="Sell" />
      <Screen>
        <ScreenSection
          title="Photos"
          description="Upload is represented by the generic ZORA uploader."
          actions={<Button>Publish</Button>}
        >
          <Uploader
            label="Listing photos"
            description="Add clear photos from multiple angles."
            onChange={() => undefined}
            type="image"
            value={null}
          />
        </ScreenSection>

        <ScreenSection
          title="Details"
          description="A minimal listing form without local style objects."
        >
          <Form submitLabel="Publish">
            <Field label="Title">
              <TextInput placeholder="Walnut lounge chair" />
            </Field>
            <Field label="Price">
              <TextInput placeholder="CHF 420" />
            </Field>
            <Field label="Description">
              <TextInput
                multiline
                placeholder="Describe condition, pickup details, and what is included..."
              />
            </Field>
          </Form>
        </ScreenSection>

        <ScreenSection title="Readiness">
          <Card
            title="Draft listing"
            description="Add photos, price, and pickup location before publishing."
            actions={<Badge color="warning">Draft</Badge>}
            tone="subtle"
          />
          <Card
            title="Static commerce example"
            description="Payments, checkout, and seller verification belong outside this ZORA UI example."
            eyebrow={<Badge color="primary">PRIMARY</Badge>}
            tone="subtle"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
