import { createZoraTheme, Tabs, Toolbar, ZoraProvider } from '@ankhorage/zora';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ComponentsPage } from './app/components';
import { HomePage } from './app/home';
import { PatternsPage } from './app/patterns';

function AppWrapper() {
  const [activeTab, setActiveTab] = React.useState('home');

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.navHeader}>
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
          </Toolbar>
        </View>
        <View style={styles.content}>{renderContent()}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ZoraProvider
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
      <AppWrapper />
    </ZoraProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
});
