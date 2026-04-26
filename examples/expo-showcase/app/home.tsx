import { Badge, Button, Card, Page, PageHeader, PageSection } from '@ankhorage/zora';
import React from 'react';
import { ScrollView } from 'react-native';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <ScrollView>
      <Page
        header={
          <PageHeader
            eyebrow="ZORA Showcase"
            title="Build polished Expo and React Native Web interfaces"
            description="Explore ZORA components and scenario-based patterns in one small showcase app."
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
        </PageSection>
      </Page>
    </ScrollView>
  );
}
