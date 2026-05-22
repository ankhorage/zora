import {
  AppBar,
  AppShell,
  Screen,
  ScreenSection,
  Text,
  ZoraProvider,
  type ZoraTheme,
} from '@ankhorage/zora';

const basicTheme: ZoraTheme = {
  id: 'basic-app',
  name: 'Basic app',
  appCategory: 'developer_tools',
  primaryColor: '#0b6e99',
  harmony: 'analogous',
};

/***
 * Minimal ZORA app root.
 *
 * Use `ZoraProvider` once at the application root, place `AppShell` inside it,
 * and use `AppBar` as the default header slot for a simple app frame.
 *
 * @usage
 * @readme
 */
export default function BasicApp() {
  return (
    <ZoraProvider initialMode="light" theme={basicTheme}>
      <AppShell header={<AppBar title="Dashboard" subtitle="Welcome to ZORA" />}>
        <Screen>
          <ScreenSection>
            <Text variant="lead">Build your app content inside the shell.</Text>
          </ScreenSection>
        </Screen>
      </AppShell>
    </ZoraProvider>
  );
}
