import { ZoraProvider, type ZoraTheme } from '@ankhorage/zora';
import { Stack } from 'expo-router';

const theme: ZoraTheme = {
  id: 'marketplace',
  name: 'Marketplace',
  appCategory: 'shopping_commerce',
  primaryColor: '#ea580c',
  harmony: 'splitComplementary',
};

export default function RootLayout() {
  return (
    <ZoraProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}
