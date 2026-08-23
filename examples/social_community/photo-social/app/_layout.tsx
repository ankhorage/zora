import { ZoraProvider } from '@ankhorage/zora';
import { Stack } from 'expo-router';

import { useZoraIconFonts } from '../src/hooks/use-zora-icon-fonts';

export default function RootLayout() {
  const iconFontsLoaded = useZoraIconFonts();

  if (!iconFontsLoaded) {
    return null;
  }

  return (
    <ZoraProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}
