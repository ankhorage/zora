import { Badge, Card, ListSection, Notice, Page, PageHeader } from '@ankhorage/zora';

const settingsRows = [
  {
    title: 'Privacy',
    description: 'Last seen, read receipts, profile visibility, and blocked contacts.',
    meta: 'Custom',
    variant: 'card' as const,
  },
  {
    title: 'Notifications',
    description: 'Message previews, group alerts, mentions, and call sounds.',
    meta: 'Enabled',
    variant: 'card' as const,
  },
  {
    title: 'Storage',
    description: 'Media auto-downloads, cached attachments, and backup status.',
    meta: '2.4 GB',
    variant: 'card' as const,
  },
] as const;

export default function SettingsScreen() {
  return (
    <Page
      header={
        <PageHeader
          title="Settings"
          description="Messaging preferences, privacy, and account controls."
          actions={<Badge tone="neutral">Starter</Badge>}
        />
      }
    >
      <ScreenSection title="Security">
        <Notice
          title="End-to-end encryption placeholder"
          description="The example models the UI, not cryptography or messaging infrastructure."
          tone="success"
        />
      </ScreenSection>

      <ListSection
        title="Preferences"
        description="Settings rows stay within ZORA list/card patterns."
        items={settingsRows}
      />

      <ScreenSection title="Template note">
        <Card
          title="Private Messaging example"
          description="Real Expo Router app, ZORA-only UI, and no local styling workaround layer."
          actions={<Badge tone="success">Verified shape</Badge>}
          tone="subtle"
        />
      </ScreenSection>
    </Page>
  );
}
