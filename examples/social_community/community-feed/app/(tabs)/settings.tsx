import { AppBar, Badge, Card, ListSection, Notice, Screen, ScreenSection } from '@ankhorage/zora';

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
    title: 'Review tools',
    description: 'Queue, blocked words, and group role defaults.',
    meta: '3 open',
    variant: 'card' as const,
  },
] as const;

export default function SettingsScreen() {
  return (
    <>
      <AppBar
        title="Settings"
        subtitle="Account, privacy, notifications, and community preferences."
        actions={<Badge tone="neutral">Starter</Badge>}
      />
      <Screen>
        <ScreenSection title="Status">
          <Notice
            title="Template-ready settings"
            description="This route is intentionally static. Data binding belongs in a later template/runtime step."
            tone="primary"
          />
        </ScreenSection>

        <ListSection
          title="Preferences"
          description="Structured rows with no local styling layer."
          items={settingsRows}
        />

        <ScreenSection title="Account">
          <Card
            title="Community Feed example"
            description="Real Expo Router app, ZORA-only UI, category-based location."
            actions={<Badge tone="success">Verified shape</Badge>}
            tone="subtle"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
