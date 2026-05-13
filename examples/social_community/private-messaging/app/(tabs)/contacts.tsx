import {
  Avatar,
  Badge,
  Button,
  ListSection,
  Screen,
  ScreenSection,
  SearchBar,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const contactRows = [
  {
    title: 'Mia Chen',
    description: 'Product designer · Available',
    meta: 'Online',
    leading: <Avatar name="Mia Chen" tone="primary" />,
    action: (
      <Button emphasis="ghost" leadingIcon={{ name: 'chatbubble-outline' }}>
        Message
      </Button>
    ),
    variant: 'card' as const,
  },
  {
    title: 'Noah Keller',
    description: 'Community operations · Busy until 14:00',
    meta: 'Busy',
    leading: <Avatar name="Noah Keller" tone="success" />,
    action: (
      <Button emphasis="ghost" leadingIcon={{ name: 'chatbubble-outline' }}>
        Message
      </Button>
    ),
    variant: 'card' as const,
  },
  {
    title: 'Lea Meyer',
    description: 'Frontend engineer · Usually replies in an hour',
    meta: 'Away',
    leading: <Avatar name="Lea Meyer" tone="warning" />,
    action: (
      <Button emphasis="ghost" leadingIcon={{ name: 'chatbubble-outline' }}>
        Message
      </Button>
    ),
    variant: 'card' as const,
  },
] as const;

export default function ContactsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Contacts"
        subtitle="People and groups available for direct messages."
        actions={<Badge tone="primary">128 contacts</Badge>}
      />
      <Screen>
        <ScreenSection
          title="Find people"
          description="A searchable contact directory without local input styling."
        >
          <SearchBar value="" placeholder="Search contacts" />
        </ScreenSection>

        <ListSection
          title="Favorites"
          description="Contact rows use ZORA avatars, buttons, and list semantics."
          items={contactRows}
        />
      </Screen>
    </>
  );
}
