import { AvatarGroup, Badge, Card, ListSection, Screen, ScreenSection, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const boardRows = [
  {
    title: 'Studio interiors',
    description: 'Desk setups, shelves, lighting, and calm productivity corners.',
    meta: '124 pins',
    variant: 'card' as const,
  },
  {
    title: 'Food market colors',
    description: 'Seasonal palettes, table settings, and restaurant inspiration.',
    meta: '88 pins',
    variant: 'card' as const,
  },
  {
    title: 'Weekend trips',
    description: 'Small hotels, train routes, and destination mood boards.',
    meta: '42 pins',
    variant: 'card' as const,
  },
] as const;

export default function BoardsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Boards"
        subtitle="Organize saved ideas into reusable visual collections."
        actions={<Badge tone="primary">12 boards</Badge>}
      />
      <Screen>
        <ScreenSection
          title="Shared board"
          description="A collaborative board preview composed from ZORA primitives."
        >
          <Card
            title="Launch moodboard"
            description="Visual direction for the next product landing page."
            actions={
              <AvatarGroup
                items={[
                  { id: 'mia', name: 'Mia Chen', tone: 'primary' },
                  { id: 'noah', name: 'Noah Keller', tone: 'success' },
                  { id: 'lea', name: 'Lea Meyer', tone: 'warning' },
                ]}
              />
            }
          >
            <Text tone="muted">
              Shared boards are static here; collaboration features belong later.
            </Text>
          </Card>
        </ScreenSection>

        <ListSection
          title="Your boards"
          description="ListSection works, but visual board covers need a richer pattern later."
          items={boardRows}
        />
      </Screen>
    </>
  );
}
