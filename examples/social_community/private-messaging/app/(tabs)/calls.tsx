import { Avatar, Badge, Button, ListSection, Notice, Screen, ScreenSection } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const callRows = [
  {
    title: 'Mia Chen',
    description: 'Missed voice call',
    meta: 'Today · 09:12',
    leading: <Avatar name="Mia Chen" color="primary" />,
    action: (
      <Button variant="ghost" leadingIcon={{ name: 'call-outline' }}>
        Call
      </Button>
    ),
    variant: 'card' as const,
  },
  {
    title: 'Noah Keller',
    description: 'Outgoing video call',
    meta: 'Yesterday · 18:44',
    leading: <Avatar name="Noah Keller" color="success" />,
    action: (
      <Button variant="ghost" leadingIcon={{ name: 'videocam-outline' }}>
        Video
      </Button>
    ),
    variant: 'card' as const,
  },
  {
    title: 'Lea Meyer',
    description: 'Incoming voice call',
    meta: 'Monday · 14:05',
    leading: <Avatar name="Lea Meyer" color="warning" />,
    action: (
      <Button variant="ghost" leadingIcon={{ name: 'call-outline' }}>
        Call
      </Button>
    ),
    variant: 'card' as const,
  },
] as const;

export default function CallsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Calls"
        subtitle="Recent voice and video interactions for a private messaging app."
        actions={<Badge color="neutral">Static</Badge>}
      />
      <Screen>
        <ScreenSection title="Availability">
          <Notice
            title="Call history only"
            description="The example models the UI surface. Real voice/video infrastructure belongs outside ZORA."
            color="primary"
          />
        </ScreenSection>

        <ListSection
          title="Recent calls"
          description="ZORA rows with avatars and structured actions."
          items={callRows}
        />
      </Screen>
    </>
  );
}
