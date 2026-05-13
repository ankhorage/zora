import { ZoraProvider } from '@ankhorage/zora';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ZoraProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}
