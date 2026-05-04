import {
  AuthLayout,
  Badge,
  Button,
  Card,
  PageSection,
  SettingsLayout,
  SidebarLayout,
  Stack,
  Surface,
  Text,
  TopbarLayout,
} from '@ankhorage/zora';
import React from 'react';

export function LayoutsShowcaseSection() {
  return (
    <PageSection title="Layouts">
      <Card
        title="AuthLayout"
        description="Centered auth surfaces with title, description, and footer."
      >
        <AuthLayout
          eyebrow="Secure area"
          title="Welcome back"
          description="AuthLayout keeps sign-in flows visually focused."
          footer={<Text tone="muted">Need access? Contact an admin.</Text>}
        >
          <Button size="s">Continue</Button>
        </AuthLayout>
      </Card>

      <Card
        title="SettingsLayout"
        description="Settings pages can pair navigation with focused content."
      >
        <SettingsLayout
          title="Workspace settings"
          description="Compact showcase example."
          sidebar={
            <Stack gap="s">
              <Badge tone="primary">General</Badge>
              <Badge tone="neutral" emphasis="soft">
                Members
              </Badge>
            </Stack>
          }
          actions={<Button size="s">Save</Button>}
        >
          <Surface variant="subtle" p="m">
            <Text>Settings content area</Text>
          </Surface>
        </SettingsLayout>
      </Card>

      <Card title="SidebarLayout" description="Sidebar, content, and optional aside regions.">
        <SidebarLayout
          sidebar={
            <Stack gap="s">
              <Text weight="semiBold">Sidebar</Text>
              <Badge tone="neutral">Navigation</Badge>
            </Stack>
          }
          aside={<Text tone="muted">Aside</Text>}
        >
          <Surface variant="subtle" p="m">
            <Text>Main content</Text>
          </Surface>
        </SidebarLayout>
      </Card>

      <Card
        title="TopbarLayout"
        description="Topbar plus optional sidebar for editor-style screens."
      >
        <TopbarLayout
          topbar={
            <Surface variant="outline" p="s">
              <Text weight="semiBold">Topbar</Text>
            </Surface>
          }
          sidebar={<Badge tone="primary">Tools</Badge>}
        >
          <Surface variant="subtle" p="m">
            <Text>Topbar content area</Text>
          </Surface>
        </TopbarLayout>
      </Card>
    </PageSection>
  );
}
