import {
  Avatar,
  Badge,
  Card,
  ListSection,
  MetricCard,
  Screen,
  ScreenSection,
  Text,
} from '@ankhorage/zora';

import { ExampleAppBar } from '../ExampleAppBar';

const sellerRows = [
  {
    title: 'Seller verification',
    description: 'Identity confirmed and pickup address verified.',
    meta: 'Complete',
    variant: 'card' as const,
  },
  {
    title: 'Active listings',
    description: 'Furniture, electronics, and home goods currently visible.',
    meta: '8 listings',
    variant: 'card' as const,
  },
  {
    title: 'Saved searches',
    description: 'Vintage chairs, camera gear, and ceramic dinnerware.',
    meta: '3 alerts',
    variant: 'card' as const,
  },
] as const;

export default function ProfileScreen() {
  return (
    <>
      <ExampleAppBar title="Marketplace profile" />
      <Screen>
        <ScreenSection
          title="Seller card"
          description="A commerce profile composed from existing ZORA cards."
          actions={<Avatar name="Nora Frei" color="primary" />}
        >
          <Card
            title="Nora Frei"
            description="Zürich · 4.9 seller rating · replies within one hour"
            actions={<Badge color="success">Verified</Badge>}
          >
            <Text emphasis="muted">
              Local pickup preferred. Furniture, ceramics, and camera equipment.
            </Text>
          </Card>
        </ScreenSection>

        <ScreenSection title="Stats">
          <MetricCard label="Rating" value="4.9" description="42 reviews" />
          <MetricCard
            label="Sold"
            value="128"
            delta="+12"
            deltaColor="success"
            description="Last 90 days"
          />
          <MetricCard label="Saved" value="36" description="Products and searches" />
        </ScreenSection>

        <ListSection
          title="Account"
          description="Profile actions stay in structured ZORA rows."
          items={sellerRows}
        />
      </Screen>
    </>
  );
}
