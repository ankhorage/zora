import { Avatar, Badge, ListSection, Notice, Screen, ScreenSection } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const activityRows = [
  {
    title: 'Mia liked your carousel',
    description: 'Golden hour terrace received a new reaction.',
    meta: '2m',
    leading: <Avatar name="Mia Chen" color="primary" />,
    variant: 'card' as const,
  },
  {
    title: 'Marco saved your post',
    description: 'City textures was added to his inspiration board.',
    meta: '18m',
    leading: <Avatar name="Marco Silva" color="success" />,
    variant: 'card' as const,
  },
  {
    title: 'Aya commented',
    description: 'Asked which lens you used for the night market photo.',
    meta: '1h',
    leading: <Avatar name="Aya Novak" color="warning" />,
    variant: 'card' as const,
  },
] as const;

export default function ActivityScreen() {
  return (
    <>
      <ExampleAppBar
        title="Activity"
        subtitle="Likes, saves, comments, follows, and creator updates."
        actions={<Badge color="primary">3 new</Badge>}
      />
      <Screen>
        <ScreenSection title="Highlights">
          <Notice
            title="Audience is active"
            description="Your last photo story is driving more saves than comments today."
            color="success"
          />
        </ScreenSection>

        <ListSection
          title="Recent activity"
          description="Social notification rows using ZORA list and avatar components."
          items={activityRows}
        />
      </Screen>
    </>
  );
}
