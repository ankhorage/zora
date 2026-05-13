import { Stack } from 'expo-router';
import { ZoraProvider } from '@ankhorage/zora';

export default function RootLayout() {
  return (
    <ZoraProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}
