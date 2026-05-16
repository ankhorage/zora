import {
  AvatarGroup,
  Badge,
  Card,
  ListSection,
  Screen,
  ScreenSection,
  Text,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const groupRows = [
  {
    title: 'Design Systems Circle',
    description: 'Weekly critiques, component decisions, and shared UI notes.',
    meta: '128 members',
    variant: 'card' as const,
  },
  {
    title: 'Founders Lounge',
    description: 'Product builders trading launch notes and early customer feedback.',
    meta: '84 members',
    variant: 'card' as const,
  },
  {
    title: 'Mobile Makers',
    description: 'Patterns for native-first app experiences and cross-platform details.',
    meta: '212 members',
    variant: 'card' as const,
  },
] as const;

export default function GroupsScreen() {
  return (
    <>
      <ExampleAppBar title="Groups" />
      <Screen>
        <ScreenSection
          title="Featured room"
          description="A composed ZORA card for the most active group."
          actions={<Badge color="primary">3 active</Badge>}
        >
          <Card
            title="Design systems circle"
            description="128 members · 14 new posts · weekly critique on Friday."
            actions={
              <AvatarGroup
                items={[
                  { id: 'mia', name: 'Mia Chen' },
                  { id: 'noah', name: 'Noah Keller', color: 'success' },
                  { id: 'lea', name: 'Lea Meyer', color: 'warning' },
                ]}
              />
            }
          >
            <Text emphasis="muted">The screen stays realistic without local layout wrappers.</Text>
          </Card>
        </ScreenSection>

        <ListSection
          title="Your groups"
          description="Static data now, template data binding later."
          items={groupRows}
        />
      </Screen>
    </>
  );
}
