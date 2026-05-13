import {
  Badge,
  Button,
  Card,
  ImageUploadField,
  Notice,
  Page,
  PageHeader,
  Textarea,
} from '@ankhorage/zora';

export default function CreateScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Create"
          description="Compose a visual post with ZORA form and media patterns."
          actions={<Button>Publish</Button>}
        />
      }
    >
      <ScreenSection
        title="Image"
        description="The upload field is a ZORA pattern, not a local wrapper."
      >
        <ImageUploadField
          label="Cover image"
          description="Choose a photo for the next visual story."
          actionLabel="Choose image"
        />
      </ScreenSection>

      <ScreenSection title="Caption" description="Structured inputs keep the app theme-aware.">
        <Textarea placeholder="Write a caption..." />
        <Card
          title="Draft quality"
          description="Add a location, topic, and short caption before publishing."
          actions={<Badge tone="warning">Draft</Badge>}
          tone="subtle"
        />
      </ScreenSection>

      <ScreenSection title="Guidance">
        <Notice
          title="Static example only"
          description="This route demonstrates the composition surface. Upload persistence belongs in app/backend examples later."
          tone="primary"
        />
      </ScreenSection>
    </Page>
  );
}
