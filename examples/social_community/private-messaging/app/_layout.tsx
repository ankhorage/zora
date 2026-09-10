import { ZoraProvider } from '@ankhorage/zora';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useZoraIconFonts } from '../src/hooks/use-zora-icon-fonts';

export default function RootLayout() {
  const iconFontsLoaded = useZoraIconFonts();

  if (!iconFontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ZoraProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ZoraProvider>
    </GestureHandlerRootView>
  );
}
