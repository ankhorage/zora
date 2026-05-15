import { Badge, MediaCard, Screen, ScreenSection, Text } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const savedItems = [
  {
    title: 'Colorful ceramics',
    description: 'Saved from the studio interiors collection.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Colorful ceramic objects on a shelf',
  },
  {
    title: 'Market breakfast',
    description: 'Saved to food market colors.',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80',
    },
    imageLabel: 'Breakfast table with coffee and toast',
  },
] as const;

export default function SavedScreen() {
  return (
    <>
      <ExampleAppBar
        title="Saved"
        subtitle="Recently saved pins, boards, and visual references."
        actions={<Badge color="success">230 saved</Badge>}
      />
      <Screen>
        <ScreenSection
          title="Recent saves"
          description="A simple saved-items flow using existing media cards."
        >
          {savedItems.map((item) => (
            <MediaCard key={item.title} {...item} badges={<Badge color="primary">Saved</Badge>} />
          ))}
          <Text color="muted">
            Saved collections will become stronger once ZORA has a dedicated visual grid pattern.
          </Text>
        </ScreenSection>
      </Screen>
    </>
  );
}
