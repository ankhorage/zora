import { ZoraProvider, type ZoraTheme } from '@ankhorage/zora';
import { Stack } from 'expo-router';

const theme: ZoraTheme = {
  id: 'community-feed',
  name: 'Community Feed',
  appCategory: 'social_community',
  primaryColor: '#4f46e5',
  harmony: 'analogous',
};

export default function RootLayout() {
  return (
    <ZoraProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}
