import { ZoraProvider, type ZoraTheme } from '@ankhorage/zora';
import { Stack } from 'expo-router';

const theme: ZoraTheme = {
  id: 'visual-discovery',
  name: 'Visual Discovery',
  appCategory: 'social_community',
  primaryColor: '#9333ea',
  harmony: 'tetradic',
};

export default function RootLayout() {
  return (
    <ZoraProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}
