import {
  AppShell,
  Badge,
  Button,
  Card,
  Grid,
  KeyboardAvoidingView,
  ScreenSection,
  ScrollView,
  Surface,
  Text,
  View,
} from '@ankhorage/zora';
import React from 'react';

export function LayoutsShowcaseSection() {
  return (
    <ScreenSection title="Layouts">
      <Card
        title="Focused composition"
        description="View composes alignment, spacing, and responsive direction without layout-specific wrappers."
      >
        <KeyboardAvoidingView behavior="padding">
          <View align="center" justify="center" px="m" py="xl">
            <Card
              compact
              eyebrow="Secure area"
              title="Welcome back"
              description="Focused auth flows compose directly from canonical primitives."
              footer={<Text emphasis="muted">Need access? Contact an admin.</Text>}
            >
              <View gap="m">
                <Button size="s">Continue</Button>
              </View>
            </Card>
          </View>
        </KeyboardAvoidingView>
      </Card>

      <Card
        title="Responsive regions"
        description="The owning feature decides what each region means; View owns only geometry."
      >
        <View direction={{ base: 'column', lg: 'row' }} gap="m">
          <Surface variant="outline" p="m" width={{ base: '100%', lg: 220 }}>
            <View gap="s">
              <Text weight="semiBold">Supporting region</Text>
              <Badge color="neutral">Navigation or tools</Badge>
            </View>
          </Surface>
          <Surface flex={1} variant="subtle" p="m">
            <Text>Main content remains the semantic owner's responsibility.</Text>
          </Surface>
        </View>
      </Card>

      <Card
        title="Auto-fit grid"
        description="Grid fills available width from a minimum item size."
      >
        <Grid minItemWidth={160} gap="m">
          <Surface variant="subtle" p="m">
            <Text>One</Text>
          </Surface>
          <Surface variant="subtle" p="m">
            <Text>Two</Text>
          </Surface>
          <Surface variant="subtle" p="m">
            <Text>Three</Text>
          </Surface>
        </Grid>
      </Card>

      <Card
        title="Bounded scrolling"
        description="ScrollView is explicit when a nested region owns scrolling."
      >
        <View height={150}>
          <ScrollView>
            <View gap="s" p="s">
              {Array.from({ length: 8 }, (_, index) => (
                <Surface key={index} variant="outline" p="s">
                  <Text>Scrollable item {index + 1}</Text>
                </Surface>
              ))}
            </View>
          </ScrollView>
        </View>
      </Card>

      <Card
        title="App shell"
        description="AppShell provides only stable app-frame slots, not navigation semantics."
      >
        <View height={220}>
          <AppShell
            header={
              <Surface p="s" variant="outline">
                <Text weight="semiBold">Header</Text>
              </Surface>
            }
            footer={
              <Surface p="s" variant="outline">
                <Text emphasis="muted">Footer</Text>
              </Surface>
            }
          >
            <View flex={1} p="m">
              <Text>Shell content</Text>
            </View>
          </AppShell>
        </View>
      </Card>
    </ScreenSection>
  );
}
