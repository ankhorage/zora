import { ZoraProvider, type ZoraTheme } from '@ankhorage/zora';
import { Stack } from 'expo-router';

const theme: ZoraTheme = {
  id: 'storefront',
  name: 'Studio Store',
  appCategory: 'shopping_commerce',
  primaryColor: '#ca8a04',
  harmony: 'analogous',
};

export default function RootLayout() {
  return (
    <ZoraProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}
