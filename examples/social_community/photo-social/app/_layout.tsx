import { ZoraProvider, type ZoraTheme } from '@ankhorage/zora';
import { Stack } from 'expo-router';

const theme: ZoraTheme = {
  id: 'photo-social',
  name: 'Photo Social',
  appCategory: 'social_community',
  primaryColor: '#db2777',
  harmony: 'triadic',
};

export default function RootLayout() {
  return (
    <ZoraProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}
