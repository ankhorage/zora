import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {
  AuthLayout,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  createZoraTheme,
  Drawer,
  EmptyState,
  FormField,
  Input,
  Modal,
  Notice,
  Page,
  PageHeader,
  PageSection,
  Panel,
  SectionHeader,
  SettingsLayout,
  SettingsRow,
  SidebarLayout,
  Textarea,
  TopbarLayout,
  ZoraProvider,
} from '@ankhorage/zora';

function ShowcaseApp() {
  const [email, setEmail] = React.useState('hello@ankhorage.dev');
  const [notes, setNotes] = React.useState(
    'ZORA sits above Surface and gives the app a stronger visual language.',
  );
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [compactMode, setCompactMode] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [archived, setArchived] = React.useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Page
          header={
            <PageHeader
              actions={
                <View style={styles.inlineActions}>
                  <Badge>Expo</Badge>
                  <Badge emphasis="outline" tone="neutral">
                    Local Package
                  </Badge>
                </View>
              }
              description="This Expo showcase renders every current ZORA component, pattern, and layout on one screen."
              eyebrow="examples/expo-showcase"
              meta={
                <View style={styles.inlineActions}>
                  <Badge emphasis="soft" tone="success">
                    surface-powered
                  </Badge>
                  <Badge emphasis="soft" tone="warning">
                    design-system layer
                  </Badge>
                </View>
              }
              title="ZORA Expo Showcase"
            />
          }
          width="wide"
        >
          <PageSection
            actions={
              <Button
                emphasis="soft"
                leadingIcon={{ name: 'albums-outline' }}
                onPress={() => setDrawerVisible(true)}
                tone="neutral"
              >
                Open Drawer
              </Button>
            }
            description="Buttons, badges, cards, inputs, textarea, modal, and drawer all sit directly on top of Surface."
            title="Core Components"
          >
            <Card
              actions={
                <View style={styles.inlineActions}>
                  <Button
                    leadingIcon={{ name: 'sparkles-outline' }}
                    onPress={() => setModalVisible(true)}
                  >
                    Open Modal
                  </Button>
                  <Button
                    emphasis="soft"
                    leadingIcon={{ name: 'warning-outline' }}
                    onPress={() => setConfirmVisible(true)}
                    tone="danger"
                  >
                    Confirm Flow
                  </Button>
                </View>
              }
              compact={compactMode}
              description="A single card can act as a polished panel, a touch target, or a lightweight section shell."
              eyebrow="Card"
              footer={
                <View style={styles.inlineActions}>
                  <Badge emphasis="soft" tone="success">
                    ready-made defaults
                  </Badge>
                  <Badge emphasis="outline" tone="neutral">
                    {compactMode ? 'compact' : 'comfortable'}
                  </Badge>
                </View>
              }
              title="Surface wrappers with stronger defaults"
              tone="default"
            >
              <View style={styles.formStack}>
                <FormField
                  description="Icons come from the Expo host app and the input defaults to the larger ZORA control size."
                  helperText="This demonstrates the wrapper on top of Surface.TextInput."
                  label="Email"
                >
                  <Input
                    autoCapitalize="none"
                    keyboardType="email-address"
                    leadingIcon={{ name: 'mail-outline' }}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    value={email}
                  />
                </FormField>

                <FormField
                  description="The textarea keeps Surface behavior but pushes stronger spacing and composition conventions."
                  helperText="Useful for notes, summaries, and product-facing forms."
                  label="Notes"
                >
                  <Textarea
                    leadingIcon={{ name: 'document-text-outline' }}
                    onChangeText={setNotes}
                    rows={5}
                    value={notes}
                  />
                </FormField>

                <View style={styles.inlineActions}>
                  <Button
                    leadingIcon={{ name: 'checkmark-circle-outline' }}
                    onPress={() => setArchived(false)}
                  >
                    Save Draft
                  </Button>
                  <Button
                    emphasis="outline"
                    leadingIcon={{ name: 'archive-outline' }}
                    onPress={() => setArchived(true)}
                    tone="neutral"
                  >
                    Archive
                  </Button>
                  <Badge tone={archived ? 'warning' : 'success'}>
                    {archived ? 'archived' : 'active'}
                  </Badge>
                </View>
              </View>
            </Card>
          </PageSection>

          <PageSection
            description="These are the product-facing building blocks that make ZORA feel like a UI kit instead of a primitive library."
            title="Patterns"
          >
            <View style={styles.sectionStack}>
              <SectionHeader
                actions={
                  <Badge emphasis="outline" tone="neutral">
                    Standalone
                  </Badge>
                }
                description="SectionHeader is also available directly when you need it outside PageSection."
                eyebrow="SectionHeader"
                title="Small compositional surfaces"
              />

              <Panel
                actions={
                  <Button emphasis="soft" tone="neutral">
                    Compare
                  </Button>
                }
                description="Panels wrap the card shell into a deliberately named composition surface."
                eyebrow="Panel"
                title="Release Candidate"
              >
                <Text style={styles.bodyText}>
                  Use panels for richer sections, in-product summaries, or mid-level app surfaces.
                </Text>
              </Panel>

              <Notice
                actions={
                  <Button emphasis="soft" onPress={() => setModalVisible(true)} tone="neutral">
                    Read details
                  </Button>
                }
                description="Notices combine a title, semantic tone, and optional actions."
                title="The publish pipeline is ready"
                tone="success"
              >
                <Text style={styles.bodyText}>
                  The same pattern works for release notes, maintenance banners, and migration prompts.
                </Text>
              </Notice>

              <EmptyState
                description="EmptyState gives you a consistent no-data surface without dropping to ad hoc layout code."
                eyebrow="EmptyState"
                footer={
                  <Badge emphasis="outline" tone="neutral">
                    no business logic included
                  </Badge>
                }
                primaryAction={{
                  label: 'Create first project',
                  onPress: () => setModalVisible(true),
                }}
                secondaryAction={{
                  emphasis: 'outline',
                  label: 'Import existing data',
                  onPress: () => setDrawerVisible(true),
                  tone: 'neutral',
                }}
                title="Nothing here yet"
              />

              <SettingsRow
                control={
                  <Switch
                    onValueChange={setNotificationsEnabled}
                    value={notificationsEnabled}
                  />
                }
                description="A compact setting row with room for controls or metadata."
                meta="Recommended"
                title="Notifications"
              />
            </View>
          </PageSection>

          <PageSection
            description="Layouts stay generic, but they move ZORA into reusable app-shell territory."
            title="Layouts"
          >
            <View style={styles.sectionStack}>
              <Card
                compact
                description="SidebarLayout composes side navigation, content, and optional aside content."
                eyebrow="SidebarLayout"
                title="Dashboard shell preview"
                tone="subtle"
              >
                <SidebarLayout
                  aside={
                    <Notice
                      description="Side content can stay lightweight and contextual."
                      title="Aside"
                      tone="warning"
                    />
                  }
                  sidebar={
                    <Card
                      compact
                      description="Put navigation, filters, or project selectors here."
                      title="Sidebar"
                      tone="outline"
                    />
                  }
                >
                  <Panel
                    description="The center area keeps the main content and can freely use other ZORA patterns."
                    title="Main content"
                  >
                    <Text style={styles.bodyText}>
                      This layout works well for dashboards, editors, and settings areas.
                    </Text>
                  </Panel>
                </SidebarLayout>
              </Card>

              <Card
                compact
                description="TopbarLayout stacks a top surface above content and can optionally reuse SidebarLayout underneath."
                eyebrow="TopbarLayout"
                title="Top navigation shell preview"
                tone="subtle"
              >
                <TopbarLayout
                  sidebar={
                    <Card compact title="Secondary Nav" tone="outline">
                      <Text style={styles.bodyText}>Shortcuts and context.</Text>
                    </Card>
                  }
                  topbar={
                    <Card
                      actions={
                        <View style={styles.inlineActions}>
                          <Badge tone="primary">Live</Badge>
                          <Button emphasis="soft" tone="neutral">
                            Share
                          </Button>
                        </View>
                      }
                      compact
                      title="Topbar"
                      tone="outline"
                    />
                  }
                >
                  <Panel
                    description="Use this when the app wants a top navigation surface first and side navigation second."
                    title="Workspace body"
                  >
                    <Text style={styles.bodyText}>
                      The layout remains navigation-framework agnostic.
                    </Text>
                  </Panel>
                </TopbarLayout>
              </Card>

              <Card
                compact
                description="SettingsLayout is a complete higher-level shell built from the lower layers."
                eyebrow="SettingsLayout"
                title="Settings shell preview"
                tone="subtle"
              >
                <SettingsLayout
                  actions={<Button tone="neutral">Save changes</Button>}
                  description="A reusable shell for settings and preference screens."
                  sidebar={
                    <Card compact title="Sections" tone="outline">
                      <Text style={styles.bodyText}>Profile, billing, access, notifications.</Text>
                    </Card>
                  }
                  title="Workspace Settings"
                >
                  <View style={styles.formStack}>
                    <SettingsRow
                      control={
                        <Switch
                          onValueChange={setCompactMode}
                          value={compactMode}
                        />
                      }
                      description="Toggle denser spacing for tighter overview pages."
                      title="Compact mode"
                    />
                    <SettingsRow
                      description="This row shows the same component without a trailing control."
                      meta="Inherited from organization policy"
                      title="Audit log retention"
                    />
                  </View>
                </SettingsLayout>
              </Card>

              <Card
                compact
                description="AuthLayout packages centered entry points like sign-in, onboarding, and recovery screens."
                eyebrow="AuthLayout"
                title="Auth shell preview"
                tone="subtle"
              >
                <AuthLayout
                  description="Everything is still generic and reusable across products."
                  eyebrow="AuthLayout"
                  footer={
                    <Badge emphasis="outline" tone="neutral">
                      powered by surface
                    </Badge>
                  }
                  title="Continue to ZORA"
                >
                  <FormField label="Email">
                    <Input
                      autoCapitalize="none"
                      leadingIcon={{ name: 'person-outline' }}
                      placeholder="demo@ankhorage.dev"
                    />
                  </FormField>
                  <FormField label="Password">
                    <Input
                      leadingIcon={{ name: 'lock-closed-outline' }}
                      placeholder="••••••••"
                      secureTextEntry
                    />
                  </FormField>
                  <Button fullWidth>Sign in</Button>
                  <Button emphasis="soft" fullWidth tone="neutral">
                    Continue with magic link
                  </Button>
                </AuthLayout>
              </Card>
            </View>
          </PageSection>
        </Page>
      </ScrollView>

      <Modal
        description="Use Modal for focused, centered overlay interactions."
        footer={
          <View style={styles.inlineActions}>
            <Button emphasis="soft" onPress={() => setModalVisible(false)} tone="neutral">
              Close
            </Button>
            <Button onPress={() => setModalVisible(false)}>Done</Button>
          </View>
        }
        onDismiss={() => setModalVisible(false)}
        title="Modal Example"
        visible={modalVisible}
        width="wide"
      >
        <Text style={styles.bodyText}>
          The modal keeps Surface overlay behavior but adds a stronger content shell and API for product-facing UI.
        </Text>
      </Modal>

      <Drawer
        description="Drawers are useful for contextual tasks, filters, or details that should stay near the main page."
        footer={
          <Button emphasis="soft" onPress={() => setDrawerVisible(false)} tone="neutral">
            Close drawer
          </Button>
        }
        onDismiss={() => setDrawerVisible(false)}
        title="Drawer Example"
        visible={drawerVisible}
      >
        <View style={styles.formStack}>
          <FormField label="Team name">
            <Input placeholder="Ankhorage" />
          </FormField>
          <FormField label="Internal note">
            <Textarea placeholder="This can hold draft notes or side tasks." rows={4} />
          </FormField>
        </View>
      </Drawer>

      <ConfirmDialog
        confirmLabel="Archive project"
        confirmTone="danger"
        description="ConfirmDialog is a narrow modal wrapper for destructive or high-signal decisions."
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setArchived(true);
          setConfirmVisible(false);
        }}
        title="Archive current project?"
        visible={confirmVisible}
      >
        <Text style={styles.bodyText}>
          This keeps the common confirmation shape consistent without moving business logic into the design system.
        </Text>
      </ConfirmDialog>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ZoraProvider
      initialConfig={createZoraTheme({
        light: {
          primaryColor: '#0b6e99',
          harmony: 'analogous',
          systemTone: 'jewel',
        },
        dark: {
          primaryColor: '#38bdf8',
          harmony: 'analogous',
          systemTone: 'jewel',
        },
      })}
    >
      <ShowcaseApp />
    </ZoraProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f7fb',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  inlineActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionStack: {
    gap: 16,
  },
  formStack: {
    gap: 16,
  },
  bodyText: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 21,
  },
});
