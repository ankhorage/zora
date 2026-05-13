import { Badge, Card, ListSection, Notice, Page, PageHeader, PageSection } from '@ankhorage/zora';

const settingsRows = [
  {
    title: 'Privacy',
    description: 'Control who can see posts, groups, and saved collections.',
    meta: 'Friends',
    variant: 'card' as const,
  },
  {
    title: 'Notifications',
    description: 'Daily highlights are enabled for followed groups and direct messages.',
    meta: 'Digest',
    variant: 'card' as const,
  },
  {
    title: 'Moderation',
    description: 'Review queue, blocked words, and group role defaults.',
    meta: '3 open',
    variant: 'card' as const,
  },
] as const;

export default function SettingsScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Settings"
          description="Account, privacy, notifications, and moderation preferences."
          actions={<Badge tone="neutral">Starter</Badge>}
        />
      }
    >
      <PageSection title="Status">
        <Notice
          title="Template-ready settings"
          description="This route is intentionally static. Data binding belongs in a later template/runtime step."
          tone="primary"
        />
      </PageSection>

      <ListSection
        title="Preferences"
        description="Structured rows with no local styling layer."
        items={settingsRows}
      />

      <PageSection title="Account">
        <Card
          title="Community Feed example"
          description="Real Expo Router app, ZORA-only UI, category-based location."
          actions={<Badge tone="success">Verified shape</Badge>}
          tone="subtle"
        />
      </PageSection>
    </Page>
  );
}
