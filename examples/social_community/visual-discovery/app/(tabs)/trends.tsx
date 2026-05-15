import { Badge, ListSection, MetricCard, Notice, Screen, ScreenSection } from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const trendRows = [
  {
    title: 'Warm minimalism',
    description: 'Muted rooms, natural textures, and small design objects.',
    meta: '+18%',
    variant: 'card' as const,
  },
  {
    title: 'Tiny travel guides',
    description: 'One-day itineraries, quiet cafés, and train-friendly routes.',
    meta: '+12%',
    variant: 'card' as const,
  },
  {
    title: 'Market tables',
    description: 'Seasonal food boards and editorial breakfast settings.',
    meta: '+9%',
    variant: 'card' as const,
  },
] as const;

export default function TrendsScreen() {
  return (
    <>
      <ExampleAppBar
        title="Trends"
        subtitle="Signals that help creators decide what to save, organize, and publish next."
        actions={<Badge color="primary">Weekly</Badge>}
      />
      <Screen>
        <ScreenSection title="Signals">
          <MetricCard
            label="Pins saved"
            value="42k"
            delta="+18%"
            deltaTone="success"
            description="This week"
          />
          <MetricCard
            label="Boards created"
            value="8.7k"
            delta="+6%"
            deltaTone="primary"
            description="Across visual topics"
          />
          <MetricCard
            label="Top theme"
            value="Warm minimalism"
            description="Fastest-growing collection"
          />
        </ScreenSection>

        <ListSection
          title="Trending topics"
          description="Structured rows work until richer trend cards exist."
          items={trendRows}
        />

        <ScreenSection title="Product note">
          <Notice
            title="Trend cards are a future pattern"
            description="A real visual discovery product likely needs richer trend cards with thumbnails, stats, and related boards."
            color="warning"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
