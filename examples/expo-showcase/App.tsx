import {
  AppShell,
  createZoraTheme,
  Tabs,
  Toolbar,
  ToolbarAction,
  ZoraProvider,
} from '@ankhorage/zora';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ComponentsPage } from './app/components';
import { HomePage } from './app/home';
import { PatternsPage } from './app/patterns';

type ShowcaseTab = 'home' | 'components' | 'patterns';
type ColorMode = 'light' | 'dark';

function AppWrapper() {
  const [activeTab, setActiveTab] = React.useState<ShowcaseTab>('home');
  const [colorMode, setColorMode] = React.useState<ColorMode>('light');

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
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <ZoraProvider
      key={colorMode}
      initialMode={colorMode}
      initialConfig={createZoraTheme({
        light: {
          primaryColor: '#0b6e99',
          harmony: 'analogous',
          systemTone: 'jewel',
        },
        dark: {
          primaryColor: '#38bdf8',
          harmony: 'analogous',
          systemTone: 'jewel',
        },
      })}
    >
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
