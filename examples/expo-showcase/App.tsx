import {
  AppShell,
  parseHexColorOrThrow,
  Tabs,
  Toolbar,
  ToolbarAction,
  ZoraProvider,
  type ZoraTheme,
  type ZoraThemeMode,
} from '@ankhorage/zora';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ComponentsPage } from './app/components';
import { HomePage } from './app/home';
import { PatternsPage } from './app/patterns';
import { ThemeComposerPage } from './app/theme-composer';

type ShowcaseTab = 'home' | 'components' | 'patterns' | 'theme';
type ColorMode = ZoraThemeMode;

const initialShowcaseTheme: ZoraTheme = {
  id: 'showcase',
  name: 'Showcase',
  appCategory: 'developer_tools',
  primaryColor: parseHexColorOrThrow('#0b6e99'),
  harmony: 'analogous',
};

function AppWrapper() {
  const [activeTab, setActiveTab] = React.useState<ShowcaseTab>('home');
  const [colorMode, setColorMode] = React.useState<ColorMode>('light');
  const [showcaseTheme, setShowcaseTheme] = React.useState<ZoraTheme>(initialShowcaseTheme);

  const isDark = colorMode === 'dark';

  const toggleColorMode = () => {
    setColorMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'components':
        return <ComponentsPage />;
      case 'patterns':
        return <PatternsPage />;
      case 'theme':
        return (
          <ThemeComposerPage
            mode={colorMode}
            onModeChange={setColorMode}
            onThemeChange={setShowcaseTheme}
            theme={showcaseTheme}
          />
        );
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <ZoraProvider key={colorMode} initialMode={colorMode} theme={showcaseTheme}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />

        <AppShell
          header={
            <Toolbar position="inline" compact={false}>
              <Tabs
                variant="segmented"
                size="s"
                value={activeTab}
                onValueChange={setActiveTab}
                items={[
                  { value: 'home', label: 'Home' },
                  { value: 'components', label: 'Components' },
                  { value: 'patterns', label: 'Patterns' },
                  { value: 'theme', label: 'Theme' },
                ]}
              />
              <View style={{ flex: 1 }} />
              <ToolbarAction
                active={isDark}
                icon={{ name: isDark ? 'sunny-outline' : 'moon-outline' }}
                label={isDark ? 'Use light mode' : 'Use dark mode'}
                onPress={toggleColorMode}
              />
            </Toolbar>
          }
        >
          {renderContent()}
        </AppShell>
      </SafeAreaProvider>
    </ZoraProvider>
  );
}

export default function App() {
  return <AppWrapper />;
}
