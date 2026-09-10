import { describe, expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import * as ReactNativeWeb from 'react-native-web';

import type { GradientRendererProps } from '../src/components/gradient/types';
import type { UploadAsset } from '../src/types/upload';
import type { BottomSheetPresentOptions } from '@ankhorage/surface/bottom-sheet';

let sheetRequest: BottomSheetPresentOptions | undefined;
let sheetPresents = 0;
const sheetController = {
  present: (options: BottomSheetPresentOptions) => {
    sheetRequest = options;
    sheetPresents += 1;
  },
  dismiss: () => {
    const previous = sheetRequest;
    sheetRequest = undefined;
    previous?.onDismiss?.();
  },
};

await mock.module('react-native', () => ReactNativeWeb);
await mock.module('react-native-safe-area-context', () => ({
  SafeAreaInsetsContext: React.createContext({ bottom: 0, left: 0, right: 0, top: 0 }),
}));
await mock.module('react-native-svg', () => ({
  SvgUri: ({ color, height, uri, width }: Record<string, unknown>) =>
    React.createElement('svg', {
      'data-color': color,
      'data-uri': uri,
      height,
      width,
    }),
}));
await mock.module('@ankhorage/surface/bottom-sheet', () => ({
  BottomSheetProvider: ({ children }: React.PropsWithChildren) => children,
  useBottomSheet: () => sheetController,
}));
await mock.module('expo-document-picker', () => ({
  getDocumentAsync: async () => ({
    canceled: false,
    assets: [
      { uri: 'file:///report.pdf', name: 'report.pdf', mimeType: 'application/pdf', size: 128 },
    ],
  }),
}));
await mock.module('expo-image-picker', () => ({
  launchImageLibraryAsync: async () => ({ canceled: true, assets: [] }),
}));

const { Gradient } = await import('../src/components/gradient/Gradient');
const { GradientRendererProvider } =
  await import('../src/components/gradient/GradientRendererContext');
const { Icon } = await import('../src/features/icon/adapters/inbound/Icon');
const { Container } = await import('../src/features/layout/adapters/inbound/Container');
const { Grid } = await import('../src/features/layout/adapters/inbound/Grid');
const { Show } = await import('../src/foundation/Show');
const { AppShell } = await import('../src/layout/app-shell/AppShell');
const { ZoraProvider } = await import('../src/theme/ZoraProvider');
const { BottomSheet } = await import('../src/features/bottom-sheet/public');
const { FlatList, SectionList } = await import('../src/features/list/public');
const { ContentRail } = await import('../src/features/layout/public');
const { Uploader } = await import('../src/features/uploader/public');
const { ChipGroup } = await import('../src/features/chip/public');

test('Uploader emits serializable pick, validation, and removal events without transport callbacks', async () => {
  const browserWindow = new Window({ url: 'https://zora.test/' });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    Node: browserWindow.Node,
    document: browserWindow.document,
    navigator: browserWindow.navigator,
    window: browserWindow,
  });
  const { createRoot } = await import('react-dom/client');
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  const values: (UploadAsset | null)[] = [];
  const uploads: UploadAsset[] = [];
  const removals: UploadAsset[] = [];
  const errors: string[] = [];
  const click = async (label: string) => {
    const button = Array.from(container.querySelectorAll('[role="button"],button')).find(
      (element) => element.textContent === label,
    );
    if (!button) throw new Error(`Missing button: ${label}`);
    await act(async () => {
      button.dispatchEvent(new browserWindow.MouseEvent('click', { bubbles: true }));
    });
  };
  const render = async (value?: UploadAsset, maxSizeBytes?: number, uploadState?: 'uploading') => {
    await act(async () => {
      root.render(
        <ZoraProvider>
          <Uploader
            value={value}
            maxSizeBytes={maxSizeBytes}
            uploadState={uploadState}
            onValueChange={(next) => values.push(next)}
            onUploadRequest={({ asset }) => uploads.push(asset)}
            onRemoveRequest={({ asset }) => removals.push(asset)}
            onValidationError={({ message }) => errors.push(message)}
          />
        </ZoraProvider>,
      );
    });
  };
  try {
    await render();
    await click('Select file');
    expect(uploads).toEqual([
      {
        kind: 'local',
        uri: 'file:///report.pdf',
        fileName: 'report.pdf',
        contentType: 'application/pdf',
        sizeBytes: 128,
      },
    ]);
    expect(values).toEqual(uploads);
    await render(uploads[0]);
    await click('Remove');
    expect(removals).toEqual(uploads);
    expect(values).toHaveLength(1);
    await render(undefined, 1);
    await click('Select file');
    expect(errors).toHaveLength(1);
    expect(uploads).toHaveLength(1);
    await render(undefined, undefined, 'uploading');
    expect(container.textContent).toContain('Uploading');
    await click('Select file');
    expect(uploads).toHaveLength(1);
  } finally {
    await act(async () => {
      root.unmount();
    });
    browserWindow.close();
    for (const key of ['IS_REACT_ACT_ENVIRONMENT', 'Node', 'document', 'navigator', 'window'])
      Reflect.deleteProperty(globalThis, key);
  }
});

test('ChipGroup allows unbound manifest state and retains per-item disabled state', () => {
  const markup = renderToStaticMarkup(
    <ZoraProvider>
      <ChipGroup
        multiple
        disabled={false}
        items={[{ value: 'a', label: 'Unavailable', disabled: true }]}
      />
    </ZoraProvider>,
  );
  expect(markup).toContain('Unavailable');
  expect(markup).toContain('aria-disabled="true"');
});

test('native lists render arbitrary children and declarative sections through public APIs', () => {
  const markup = renderToStaticMarkup(
    <ZoraProvider>
      <FlatList headerText="Items" initialNumToRender={2}>
        <ReactNativeWeb.Text key="a">First item</ReactNativeWeb.Text>
        <ReactNativeWeb.Text key="b">Second item</ReactNativeWeb.Text>
      </FlatList>
      <SectionList sections={[{ key: 'group', title: 'Group', itemCount: 1 }]}>
        <ReactNativeWeb.Text key="c">Section item</ReactNativeWeb.Text>
      </SectionList>
      <ContentRail itemSize="content">
        <ReactNativeWeb.Text>Intrinsic item</ReactNativeWeb.Text>
      </ContentRail>
    </ZoraProvider>,
  );
  for (const label of [
    'Items',
    'First item',
    'Second item',
    'Group',
    'Section item',
    'Intrinsic item',
  ])
    expect(markup).toContain(label);
});

test('declarative BottomSheet opens, updates children, closes, reopens, and remains passive', async () => {
  const browserWindow = new Window({ url: 'https://zora.test/' });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    Node: browserWindow.Node,
    document: browserWindow.document,
    navigator: browserWindow.navigator,
    window: browserWindow,
  });
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(document.createElement('div'));
  sheetRequest = undefined;
  sheetPresents = 0;
  try {
    await act(async () => {
      root.render(
        <BottomSheet open>
          <ReactNativeWeb.Text>First</ReactNativeWeb.Text>
        </BottomSheet>,
      );
    });
    expect(sheetPresents).toBe(1);
    expect(sheetRequest).toBeDefined();
    await act(async () => {
      root.render(
        <BottomSheet open>
          <ReactNativeWeb.Text>Updated</ReactNativeWeb.Text>
        </BottomSheet>,
      );
    });
    expect(sheetPresents).toBe(2);
    await act(async () => {
      root.render(<BottomSheet open={false} />);
    });
    expect(sheetRequest).toBeUndefined();
    await act(async () => {
      root.render(<BottomSheet open />);
    });
    expect(sheetPresents).toBe(3);
    await act(async () => {
      root.render(<BottomSheet open interactionPolicy="passive" />);
    });
    expect(sheetRequest).toBeUndefined();
    expect(sheetPresents).toBe(3);
  } finally {
    await act(async () => {
      root.unmount();
    });
    browserWindow.close();
    for (const key of ['IS_REACT_ACT_ENVIRONMENT', 'Node', 'document', 'navigator', 'window'])
      Reflect.deleteProperty(globalThis, key);
  }
});

describe('Surface 4 icon integration', () => {
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

  test('forwards SVG sources through the existing ZORA Icon', () => {
    const markup = renderToStaticMarkup(
      <ZoraProvider>
        <Icon color="#123456" size={18} source="https://example.com/icons/home.svg" />
      </ZoraProvider>,
    );

    expect(markup).toContain('data-uri="https://example.com/icons/home.svg"');
    expect(markup).toContain('data-color="#123456"');
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
