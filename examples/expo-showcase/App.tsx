import {
  AppBar,
  AppShell,
  Box,
  type GradientRendererProps,
  GradientRendererProvider,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Toolbar,
  ZoraProvider,
  type ZoraTheme,
  type ZoraThemeMode,
} from '@ankhorage/zora';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ChatsPage } from './app/chats';
import { ComponentsPage } from './app/components';
import { HomePage } from './app/home';
import { PatternsPage } from './app/patterns';
import { PostsPage } from './app/posts';
import { ThemeComposerPage } from './app/theme-composer';
import { useZoraIconFonts } from './useZoraIconFonts';

type ShowcaseTab = 'home' | 'components' | 'patterns' | 'posts' | 'chats' | 'theme';
type ColorMode = ZoraThemeMode;

const SHOWCASE_TABS = [
  { value: 'home', label: 'Home' },
  { value: 'components', label: 'Components' },
  { value: 'patterns', label: 'Patterns' },
  { value: 'posts', label: 'Posts' },
  { value: 'chats', label: 'Chats' },
  { value: 'theme', label: 'Theme' },
] as const;

const initialShowcaseTheme: ZoraTheme = {
  id: 'showcase',
  name: 'Showcase',
  appCategory: 'developer_tools',
  primaryColor: '#0b6e99',
  harmony: 'analogous',
};

function ExpoGradientRenderer({ children, ...props }: GradientRendererProps) {
  return <LinearGradient {...props}>{children}</LinearGradient>;
}

function AppWrapper() {
  const iconFontsLoaded = useZoraIconFonts();
  const [activeTab, setActiveTab] = React.useState<ShowcaseTab>('home');
  const [colorMode, setColorMode] = React.useState<ColorMode>('light');
  const [showcaseTheme, setShowcaseTheme] = React.useState<ZoraTheme>(initialShowcaseTheme);
  const isDark = colorMode === 'dark';

  if (!iconFontsLoaded) return null;

  const toggleColorMode = () => {
    setColorMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ZoraProvider key={colorMode} initialMode={colorMode} theme={showcaseTheme}>
        <GradientRendererProvider renderer={ExpoGradientRenderer}>
          <SafeAreaProvider>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Tabs value={activeTab} onValueChange={selectShowcaseTab(setActiveTab)}>
              <AppShell
                header={
                  <AppBar>
                    <Toolbar compact={false}>
                      <TabList>
                        {SHOWCASE_TABS.map((tab) => (
                          <Tab key={tab.value} label={tab.label} value={tab.value} />
                        ))}
                      </TabList>
                      <Box flex={1} />
                      <IconButton
                        color={isDark ? 'primary' : 'neutral'}
                        icon={{ name: isDark ? 'sunny-outline' : 'moon-outline' }}
                        label={isDark ? 'Use light mode' : 'Use dark mode'}
                        onPress={toggleColorMode}
                        variant={isDark ? 'soft' : 'ghost'}
                      />
                    </Toolbar>
                  </AppBar>
                }
              >
                <TabPanel value="home">
                  <HomePage onNavigate={setActiveTab} />
                </TabPanel>
                <TabPanel value="components">
                  <ComponentsPage />
                </TabPanel>
                <TabPanel value="patterns">
                  <PatternsPage />
                </TabPanel>
                <TabPanel value="posts">
                  <PostsPage />
                </TabPanel>
                <TabPanel value="chats">
                  <ChatsPage />
                </TabPanel>
                <TabPanel value="theme">
                  <ThemeComposerPage
                    mode={colorMode}
                    onModeChange={setColorMode}
                    onThemeChange={setShowcaseTheme}
                    theme={showcaseTheme}
                  />
                </TabPanel>
              </AppShell>
            </Tabs>
          </SafeAreaProvider>
        </GradientRendererProvider>
      </ZoraProvider>
    </GestureHandlerRootView>
  );
}

/*** Narrows Surface string tab values before updating the showcase page state. */
function selectShowcaseTab(
  setActiveTab: React.Dispatch<React.SetStateAction<ShowcaseTab>>,
): (value: string) => void {
  return (value) => {
    switch (value) {
      case 'home':
      case 'components':
      case 'patterns':
      case 'posts':
      case 'chats':
      case 'theme':
        setActiveTab(value);
        break;
    }
  };
}

export default function App() {
  return <AppWrapper />;
}