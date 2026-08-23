import { describe, expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import * as ReactNativeWeb from 'react-native-web';

import type { GradientRendererProps } from '../src/components/gradient/types';

await mock.module('react-native', () => ReactNativeWeb);
await mock.module('react-native-safe-area-context', () => ({
  SafeAreaInsetsContext: React.createContext({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

const { Gradient } = await import('../src/components/gradient/Gradient');
const { GradientRendererProvider } =
  await import('../src/components/gradient/GradientRendererContext');
const { Icon } = await import('../src/components/icon/Icon');
const { Container } = await import('../src/foundation/Container');
const { Grid } = await import('../src/foundation/Grid');
const { Show } = await import('../src/foundation/Show');
const { AppShell } = await import('../src/layout/app-shell/AppShell');
const { ZoraProvider } = await import('../src/theme/ZoraProvider');

describe('Surface 3 icon integration', () => {
  test('renders each supported provider/style used by ZORA', () => {
    const markup = renderToStaticMarkup(
      <ZoraProvider>
        <Icon name="home-outline" size={18} />
        <Icon name="github" provider="FontAwesome" size={18} />
        <Icon name="microsoft" provider="FontAwesome5" size={18} variant="brand" />
        <Icon name="video" provider="FontAwesome5" size={18} variant="solid" />
        <Icon name="x-twitter" provider="FontAwesome6" size={18} variant="brand" />
      </ZoraProvider>,
    );

    expect(markup).toContain('font-family:Ionicons');
    expect(markup).toContain('font-family:FontAwesome');
    expect(markup).toContain('font-family:FontAwesome5Brands-Regular');
    expect(markup).toContain('font-family:FontAwesome5Free-Solid');
    expect(markup).toContain('font-family:FontAwesome6Brands-Regular');
  });
});

function TestGradientRenderer({ children, colors }: GradientRendererProps) {
  return (
    <ReactNativeWeb.View dataSet={{ colors: colors.join(',') }}>{children}</ReactNativeWeb.View>
  );
}

describe('optional gradient renderer boundary', () => {
  test('renders through an injected portable renderer', () => {
    const markup = renderToStaticMarkup(
      <ZoraProvider>
        <GradientRendererProvider renderer={TestGradientRenderer}>
          <Gradient colors={['#000000', '#ffffff']}>
            <ReactNativeWeb.Text>Gradient content</ReactNativeWeb.Text>
          </Gradient>
        </GradientRendererProvider>
      </ZoraProvider>,
    );

    expect(markup).toContain('data-colors="#000000,#ffffff"');
    expect(markup).toContain('Gradient content');
  });

  test('fails explicitly when the host omits a renderer', () => {
    expect(() =>
      renderToStaticMarkup(
        <ZoraProvider>
          <Gradient colors={['#000000', '#ffffff']} />
        </ZoraProvider>,
      ),
    ).toThrow('Gradient requires a renderer');
  });
});

function ResponsiveAcceptanceTree() {
  return (
    <ZoraProvider>
      <AppShell overlay={<ReactNativeWeb.View testID="overlay" />} testID="app-shell">
        <Container maxWidth={{ base: 640, md: 960 }} px={{ base: 12, md: 24 }} testID="container">
          <Grid cols={{ base: 1, md: 2 }} gap={{ base: 8, md: 16 }} testID="grid">
            <ReactNativeWeb.View testID="grid-first" />
            <ReactNativeWeb.View testID="grid-second" />
          </Grid>
          <Show
            fallback={<ReactNativeWeb.Text>static-fallback</ReactNativeWeb.Text>}
            when={{ base: false, md: true }}
          >
            <ReactNativeWeb.Text>wide-content</ReactNativeWeb.Text>
          </Show>
        </Container>
      </AppShell>
    </ZoraProvider>
  );
}

test('RN Web 0.21 statically renders and hydrates ZORA layout/theme behavior', async () => {
  const markup = renderToString(<ResponsiveAcceptanceTree />);

  expect(markup).toContain('data-testid="app-shell"');
  expect(markup).toContain('data-testid="overlay"');
  expect(markup).toContain('data-testid="container"');
  expect(markup).toContain('static-fallback');
  expect(markup).not.toContain('wide-content');

  const browserWindow = new Window({ url: 'https://zora.test/' });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    Node: browserWindow.Node,
    document: browserWindow.document,
    navigator: browserWindow.navigator,
    window: browserWindow,
  });
  const container = browserWindow.document.createElement('div');
  container.innerHTML = markup;
  browserWindow.document.body.append(container);
  const hydrationErrors: string[] = [];
  const originalError = console.error;
  console.error = (...values: unknown[]) => {
    hydrationErrors.push(values.map(String).join(' '));
  };

  try {
    const { hydrateRoot } = await import('react-dom/client');
    const root = hydrateRoot(container as unknown as Element, <ResponsiveAcceptanceTree />);
    await act(async () => Promise.resolve());

    expect(container.querySelector('[data-testid="app-shell"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="overlay"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-testid^="grid-"]')).toHaveLength(2);
    expect(hydrationErrors).toEqual([]);

    act(() => root.unmount());
  } finally {
    console.error = originalError;
    browserWindow.close();
    Reflect.deleteProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT');
    Reflect.deleteProperty(globalThis, 'Node');
    Reflect.deleteProperty(globalThis, 'document');
    Reflect.deleteProperty(globalThis, 'navigator');
    Reflect.deleteProperty(globalThis, 'window');
  }
});
