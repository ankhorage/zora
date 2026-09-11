import {
  Badge,
  Button,
  Card,
  Notice,
  Screen,
  ScreenSection,
  TextInput,
  Uploader,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../../src/components/example-app-bar';

export default function CreateScreen() {
  return (
    <>
      <ExampleAppBar
        title="Create"
        subtitle="Compose a visual post with ZORA form and media patterns."
        actions={<Button>Publish</Button>}
      />
      <Screen>
        <ScreenSection
          title="Image"
          description="The upload field is a ZORA pattern, not a local wrapper."
        >
          <Uploader
            label="Cover image"
            description="Choose a photo for the next visual story."
            onChange={() => undefined}
            type="image"
            value={null}
          />
        </ScreenSection>

        <ScreenSection title="Caption" description="Structured inputs keep the app theme-aware.">
          <TextInput multiline placeholder="Write a caption..." />
          <Card
            title="Draft quality"
            description="Add a location, topic, and short caption before publishing."
            actions={<Badge color="warning">Draft</Badge>}
            tone="subtle"
          />
        </ScreenSection>

        <ScreenSection title="Guidance">
          <Notice
            title="Static example only"
            description="This route demonstrates the composition surface. Upload persistence belongs in app/backend examples later."
            color="primary"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
