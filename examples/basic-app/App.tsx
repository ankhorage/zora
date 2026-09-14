import {
  AppBar,
  AppShell,
  Screen,
  ScreenSection,
  Text,
  ZoraProvider,
  type ZoraTheme,
} from '@ankhorage/zora';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const basicTheme: ZoraTheme = {
  id: 'basic-app',
  name: 'Basic app',
  appCategory: 'developer_tools',
  primaryColor: '#0b6e99',
  harmony: 'analogous',
};

/***
 * ZORA app root with optional runtime capabilities.
 *
 * Use `ZoraProvider` once at the application root. Enable `toast` when descendants use
 * `useToast()`. Enable `bottomSheet` for native BottomSheet-backed interactions such as native
 * DatePicker and TimePicker; web pickers use Popover instead. Omit capabilities the app does not use.
 *
 * @usage
 * @readme
 */
export default function BasicApp() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ZoraProvider
        bottomSheet
        initialMode="light"
        theme={basicTheme}
        toast={{ defaultDuration: 4000 }}
      >
        <AppShell header={<AppBar title="Dashboard" subtitle="Welcome to ZORA" />}>
          <Screen>
            <ScreenSection>
              <Text variant="lead">Build your app content inside the shell.</Text>
            </ScreenSection>
          </Screen>
        </AppShell>
      </ZoraProvider>
    </GestureHandlerRootView>
  );
}
