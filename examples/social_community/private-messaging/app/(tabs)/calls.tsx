import { Avatar, Badge, Icon, ListSection, Screen, ScreenSection, SearchBar } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const callRows = [
  {
    title: 'Mia Chen',
    description: 'Missed voice call',
    meta: 'Today · 09:12',
    leading: <Avatar name="Mia Chen" tone="primary" />,
    trailing: <Icon name="call-outline" size={22} />,
  },
  {
    title: 'Noah Keller',
    description: 'Outgoing video call',
    meta: 'Yesterday · 18:44',
    leading: <Avatar name="Noah Keller" tone="success" />,
    trailing: <Icon name="call-outline" size={22} />,
  },
  {
    title: 'Lea Meyer',
    description: 'Incoming voice call',
    meta: 'Monday · 14:05',
    leading: <Avatar name="Lea Meyer" tone="warning" />,
    trailing: <Icon name="call-outline" size={22} />,
  },
  {
    title: 'Product Crew',
    description: 'Missed group voice call',
    meta: 'Sunday · 20:17',
    leading: <Avatar name="Product Crew" tone="neutral" />,
    trailing: <Icon name="call-outline" size={22} />,
  },
  {
    title: 'Aline Roth',
    description: 'Outgoing voice call',
    meta: 'Friday · 11:28',
    leading: <Avatar name="Aline Roth" tone="primary" />,
    trailing: <Icon name="call-outline" size={22} />,
  },
] as const;

export default function CallsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Calls"
        subtitle="Recent voice and video interactions for a private messaging app."
        actions={<Badge tone="neutral">Static</Badge>}
      />
      <Screen>
        <ScreenSection>
          <SearchBar value="" placeholder="Search calls" />
        </ScreenSection>

        <ListSection items={callRows} />
      </Screen>
    </>
  );
}
