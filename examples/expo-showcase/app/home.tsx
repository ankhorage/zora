import { Badge, Button, Card, Hero, Page, PageSection, Text } from '@ankhorage/zora';
import React from 'react';
import { ScrollView } from 'react-native';

type ShowcaseTab = 'home' | 'components' | 'patterns' | 'theme';

interface HomePageProps {
  onNavigate: React.Dispatch<React.SetStateAction<ShowcaseTab>>;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <ScrollView>
      <Page
        header={
          <Hero
            eyebrow="ZORA Showcase"
            title="Build polished Expo and React Native Web interfaces"
            description="Explore ZORA components, scenario-based patterns, and live theme recipes in one small showcase app."
            primaryAction={{ label: 'View patterns', onPress: () => onNavigate('patterns') }}
            secondaryAction={{
              label: 'Browse components',
              onPress: () => onNavigate('components'),
            }}
            media={
              <Card title="Theme-aware by default" tone="outline">
                <Text tone="muted">
                  Hero composes ZORA typography, actions, layout, and card surfaces into one
                  responsive pattern.
                </Text>
              </Card>
            }
          />
        }
      >
        <PageSection title="Explore the catalog">
          <Card
            title="Components"
            description="Buttons, cards, inputs, tabs, toolbars, overlays, badges, and other reusable building blocks."
            actions={
              <Button size="s" onPress={() => onNavigate('components')}>
                View components
              </Button>
            }
            footer={<Badge tone="primary">Core UI</Badge>}
          />

          <Card
            title="Patterns"
            description="Scenario-based examples for settings screens, editor sidebars, theme pickers, collections, and empty states."
            actions={
              <Button size="s" onPress={() => onNavigate('patterns')}>
                View patterns
              </Button>
            }
            footer={<Badge tone="success">Composed UI</Badge>}
          />

          <Card
            title="Theme Composer"
            description="Edit a ZORA theme seed live and inspect how harmony, primary color, and mode affect real UI surfaces."
            actions={
              <Button size="s" onPress={() => onNavigate('theme')}>
                Open theme lab
              </Button>
            }
            footer={
              <Badge tone="warning" emphasis="soft">
                Theme lab
              </Badge>
            }
          />
        </PageSection>
      </Page>
    </ScrollView>
  );
}
