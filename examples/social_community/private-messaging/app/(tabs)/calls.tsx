import {
  Avatar,
  Badge,
  Button,
  ListSection,
  Notice,
  Page,
  PageHeader,
  PageSection,
} from '@ankhorage/zora';

const callRows = [
  {
    title: 'Mia Chen',
    description: 'Missed voice call',
    meta: 'Today · 09:12',
    leading: <Avatar name="Mia Chen" tone="primary" />,
    action: (
      <Button emphasis="ghost" leadingIcon={{ name: 'call-outline' }}>
        Call
      </Button>
    ),
    variant: 'card' as const,
  },
  {
    title: 'Noah Keller',
    description: 'Outgoing video call',
    meta: 'Yesterday · 18:44',
    leading: <Avatar name="Noah Keller" tone="success" />,
    action: (
      <Button emphasis="ghost" leadingIcon={{ name: 'videocam-outline' }}>
        Video
      </Button>
    ),
    variant: 'card' as const,
  },
  {
    title: 'Lea Meyer',
    description: 'Incoming voice call',
    meta: 'Monday · 14:05',
    leading: <Avatar name="Lea Meyer" tone="warning" />,
    action: (
      <Button emphasis="ghost" leadingIcon={{ name: 'call-outline' }}>
        Call
      </Button>
    ),
    variant: 'card' as const,
  },
] as const;

export default function CallsScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Calls"
          description="Recent voice and video interactions for a private messaging app."
          actions={<Badge tone="neutral">Static</Badge>}
        />
      }
    >
      <ScreenSection title="Availability">
        <Notice
          title="Call history only"
          description="The example models the UI surface. Real voice/video infrastructure belongs outside ZORA."
          tone="primary"
        />
      </ScreenSection>

      <ListSection
        title="Recent calls"
        description="ZORA rows with avatars and structured actions."
        items={callRows}
      />
    </Page>
  );
}
