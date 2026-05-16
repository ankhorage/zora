import {
  AuthLayout,
  Badge,
  Button,
  Card,
  ScreenSection,
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
    <ScreenSection title="Layouts">
      <Card
        title="AuthLayout"
        description="Centered auth surfaces with title, description, and footer."
      >
        <AuthLayout
          eyebrow="Secure area"
          title="Welcome back"
          description="AuthLayout keeps sign-in flows visually focused."
          footer={<Text emphasis="muted">Need access? Contact an admin.</Text>}
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
              <Badge color="primary">General</Badge>
              <Badge color="neutral" variant="soft">
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
              <Badge color="neutral">Navigation</Badge>
            </Stack>
          }
          aside={<Text emphasis="muted">Aside</Text>}
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
          sidebar={<Badge color="primary">Tools</Badge>}
        >
          <Surface variant="subtle" p="m">
            <Text>Topbar content area</Text>
          </Surface>
        </TopbarLayout>
      </Card>
    </ScreenSection>
  );
}
