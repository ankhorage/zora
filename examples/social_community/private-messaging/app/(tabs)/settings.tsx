import { Badge, Card, ListSection, Notice, Screen, ScreenSection } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const settingsRows = [
  {
    title: 'Privacy',
    description: 'Last seen, read receipts, profile visibility, and blocked contacts.',
    meta: 'Custom',
  },
  {
    title: 'Notifications',
    description: 'Message previews, group alerts, mentions, and call sounds.',
    meta: 'Enabled',
  },
  {
    title: 'Storage',
    description: 'Media auto-downloads, cached attachments, and backup status.',
    meta: '2.4 GB',
  },
] as const;

export default function SettingsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Settings"
        subtitle="Messaging preferences, privacy, and account controls."
        actions={<Badge tone="neutral">Starter</Badge>}
      />
      <Screen>
        <ScreenSection title="Security">
          <Notice
            title="End-to-end encryption placeholder"
            description="The example models the UI, not cryptography or messaging infrastructure."
            tone="success"
          />
        </ScreenSection>

        <ListSection
          title="Preferences"
          description="Settings rows stay constrained inside the ZORA list section layout."
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
      </Screen>
    </>
  );
}
