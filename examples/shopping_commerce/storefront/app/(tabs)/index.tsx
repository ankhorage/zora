import {
  AvatarGroup,
  Badge,
  Button,
  MediaCard,
  Notice,
  Screen,
  ScreenSection,
  Text,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const featured = [
  {
    title: 'Everyday ceramic set',
    description: 'CHF 89 · hand-glazed breakfast pieces for quiet mornings.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Ceramic objects on a shelf',
  },
  {
    title: 'Linen table bundle',
    description: 'CHF 64 · napkins, runner, and soft natural texture.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Natural linen and table setting',
  },
] as const;

export default function HomeScreen() {
  return (
    <>
      <ExampleAppBar title="Studio Store" />
      <Screen>
        <ScreenSection
          title="New collection"
          description="A shop homepage composed from ZORA sections and media cards."
          actions={<Button leadingIcon={{ name: 'cart-outline' }}>View cart</Button>}
        >
          {featured.map((product) => (
            <MediaCard
              key={product.title}
              {...product}
              badges={<Badge tone="success">In stock</Badge>}
            />
          ))}
        </ScreenSection>

        <ScreenSection title="Social proof" actions={<Badge tone="primary">Spring edit</Badge>}>
          <Notice
            title="1,248 happy customers"
            description="Static trust messaging for the example. Reviews and payments belong in app/backend layers later."
            tone="success"
          />
          <AvatarGroup
            items={[
              { id: 'nora', name: 'Nora Frei', tone: 'primary' },
              { id: 'mia', name: 'Mia Chen', tone: 'success' },
              { id: 'lea', name: 'Lea Meyer', tone: 'warning' },
            ]}
          />
          <Text tone="muted">
            A future StorefrontHero or ProductFeature pattern would make this screen stronger.
          </Text>
        </ScreenSection>
      </Screen>
    </>
  );
}
