import { Avatar, Badge, ListSection, Notice, Page, PageHeader } from '@ankhorage/zora';

const activityRows = [
  {
    title: 'Mia liked your carousel',
    description: 'Golden hour terrace received a new reaction.',
    meta: '2m',
    leading: <Avatar name="Mia Chen" tone="primary" />,
    variant: 'card' as const,
  },
  {
    title: 'Marco saved your post',
    description: 'City textures was added to his inspiration board.',
    meta: '18m',
    leading: <Avatar name="Marco Silva" tone="success" />,
    variant: 'card' as const,
  },
  {
    title: 'Aya commented',
    description: 'Asked which lens you used for the night market photo.',
    meta: '1h',
    leading: <Avatar name="Aya Novak" tone="warning" />,
    variant: 'card' as const,
  },
] as const;

export default function ActivityScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Activity"
          description="Likes, saves, comments, follows, and creator updates."
          actions={<Badge tone="primary">3 new</Badge>}
        />
      }
    >
      <ScreenSection title="Highlights">
        <Notice
          title="Audience is active"
          description="Your last photo story is driving more saves than comments today."
          tone="success"
        />
      </ScreenSection>

      <ListSection
        title="Recent activity"
        description="Social notification rows using ZORA list and avatar components."
        items={activityRows}
      />
    </Page>
  );
}
