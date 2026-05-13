import { Badge, Card, ListSection, MetricCard, Screen, ScreenSection, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const preferenceRows = [
  {
    title: 'Dietary preferences',
    description: 'Vegetarian tasting menu, no shellfish, lemon desserts preferred.',
    meta: 'Saved',
    variant: 'card' as const,
  },
  {
    title: 'Favorite table',
    description: 'Window table or quiet corner for two.',
    meta: 'Table 8',
    variant: 'card' as const,
  },
  {
    title: 'Occasions',
    description: 'Anniversary reminder and birthday dinner notes.',
    meta: '2 notes',
    variant: 'card' as const,
  },
] as const;

export default function ProfileScreen() {
  return (
    <>
      <ExampleAppBar title="Profile" />
      <Screen>
        <ScreenSection title="Guest card">
          <Card
            title="Nora Frei"
            description="Regular guest · Zürich · last visit two weeks ago"
            actions={<Badge tone="success">VIP</Badge>}
          >
            <Text tone="muted">
              Prefers early dinner slots, vegetarian tasting menus, and quiet tables.
            </Text>
          </Card>
        </ScreenSection>

        <ScreenSection title="Guest stats">
          <MetricCard label="Visits" value="18" description="Lifetime reservations" />
          <MetricCard
            label="Upcoming"
            value="1"
            delta="Friday"
            deltaTone="primary"
            description="Next booking"
          />
          <MetricCard
            label="Points"
            value="2,840"
            delta="+180"
            deltaTone="success"
            description="Loyalty balance"
          />
        </ScreenSection>

        <ListSection
          title="Preferences"
          description="Guest profile rows remain structured and theme-aware."
          items={preferenceRows}
        />
      </Screen>
    </>
  );
}
