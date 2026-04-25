import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import {
  createZoraTheme,
  ZoraProvider,
  Tabs,
  Toolbar,
  ToolbarAction,
} from '@ankhorage/zora';

import { ComponentsPage } from './app/components';
import { PatternsPage } from './app/patterns';
import { StudioShellPage } from './app/studio-shell';

function WorkbenchApp() {
  const [activeTab, setActiveTab] = React.useState('studio');

  const renderContent = () => {
    switch (activeTab) {
      case 'components':
        return <ComponentsPage />;
      case 'patterns':
        return <PatternsPage />;
      case 'studio':
        return <StudioShellPage />;
      default:
        return <StudioShellPage />;
    }
  };

  return (
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
              { value: 'studio', label: 'Studio Shell' },
              { value: 'components', label: 'Components' },
              { value: 'patterns', label: 'Patterns' },
            ]}
          />
        </Toolbar>
      </View>
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
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
      <WorkbenchApp />
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
