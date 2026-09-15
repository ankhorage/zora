import {
  AppBar,
  AppShell,
  BottomSheet,
  Button,
  DatePicker,
  Screen,
  ScreenSection,
  Text,
  TimePicker,
  useToast,
  View,
  ZoraProvider,
  type ZoraTheme,
} from '@ankhorage/zora';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const basicTheme: ZoraTheme = {
  id: 'basic-app',
  name: 'Basic app',
  appCategory: 'developer_tools',
  primaryColor: '#0b6e99',
  harmony: 'analogous',
};

/***
 * ZORA app root with optional runtime capabilities and adaptive UI.
 *
 * Enable only the runtime capabilities the app uses. `toast` installs the host consumed by
 * `useToast()`. `bottomSheet` installs the native BottomSheet host; DatePicker and TimePicker use
 * that host on native and automatically use Popover on web.
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
              <UsageContent />
            </ScreenSection>
          </Screen>
        </AppShell>
      </ZoraProvider>
    </GestureHandlerRootView>
  );
}

/*** Demonstrates toast feedback and adaptive picker presentation. */
function UsageContent() {
  const { showToast } = useToast();
  const [date, setDate] = React.useState<string | null>(null);
  const [time, setTime] = React.useState<string | null>(null);

  return (
    <View gap="m">
      <Text variant="lead">Runtime capabilities are opt-in at the app root.</Text>
      <Button
        onPress={() =>
          showToast({
            description: 'ToastProvider is installed by ZoraProvider.',
            status: 'success',
            title: 'Saved',
          })
        }
      >
        Show toast
      </Button>
      <DatePicker label="Date" onValueChange={setDate} value={date} />
      <TimePicker label="Time" onValueChange={setTime} value={time} />
    </View>
  );
}

/***
 * Direct native BottomSheet usage.
 *
 * Render this inside `<ZoraProvider bottomSheet>` on native. Web pickers do not need this host;
 * their platform adapters use Popover instead.
 *
 * @usage
 * @readme
 */
export function NativeBottomSheetExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <View gap="m">
      <Button onPress={() => setOpen(true)}>Open native bottom sheet</Button>
      <BottomSheet onDismiss={() => setOpen(false)} open={open}>
        <View gap="s" p="m">
          <Text variant="label">Bottom sheet content</Text>
          <Button onPress={() => setOpen(false)} variant="ghost">
            Close
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
