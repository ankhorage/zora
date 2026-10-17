import type { GridRectItem, GridViewport } from '@ankhorage/grid-view';
import { afterAll, afterEach, beforeEach, expect, jest, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { createRoot } from 'react-dom/client';

import type { GridScrollAxis } from '../../../../types/grid-view';

type NativeScrollEvent = Readonly<{
  nativeEvent: Readonly<{ contentOffset: { x: number; y: number } }>;
}>;
type NativeScrollProps = Readonly<{
  onMomentumScrollEnd?: (event: NativeScrollEvent) => void;
  onScroll?: (event: NativeScrollEvent) => void;
  testID?: string;
}>;
type ScrollRequest = Readonly<{ animated?: boolean; x?: number; y?: number }>;

const browser = new Window();
const globalKeys = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'] as const;
const previousGlobals = globalKeys.map(
  (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
);
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  Node: browser.Node,
  document: browser.document,
  navigator: browser.navigator,
  window: browser,
});

const scrollHandlers = new Map<string, NativeScrollProps>();
const nativeRequests: (readonly [GridScrollAxis, number, boolean])[] = [];
const ScrollView = React.forwardRef<
  { scrollTo: (request: ScrollRequest) => void },
  React.PropsWithChildren<NativeScrollProps>
>(function ScrollView({ children, onMomentumScrollEnd, onScroll, testID }, ref) {
  React.useEffect(() => {
    if (testID !== undefined) scrollHandlers.set(testID, { onMomentumScrollEnd, onScroll, testID });
    return () => {
      if (testID !== undefined) scrollHandlers.delete(testID);
    };
  }, [onMomentumScrollEnd, onScroll, testID]);
  React.useImperativeHandle(ref, () => ({
    scrollTo: ({ animated = false, x, y }) => {
      if (x !== undefined) nativeRequests.push(['x', x, animated]);
      if (y !== undefined) nativeRequests.push(['y', y, animated]);
    },
  }));
  return <div data-testid={testID}>{children}</div>;
});

const View = React.forwardRef<
  { measureInWindow: (callback: (x: number, y: number) => void) => void },
  React.PropsWithChildren<{ testID?: string }>
>(function View({ children, testID }, ref) {
  React.useImperativeHandle(ref, () => ({ measureInWindow: (callback) => callback(0, 0) }));
  return <div data-testid={testID}>{children}</div>;
});

await mock.module('react-native', () => ({
  Pressable: ({ children }: React.PropsWithChildren) => <button>{children}</button>,
  ScrollView,
  Text: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  View,
}));

const { GridView } = await import('./GridView');

beforeEach(() => {
  jest.useFakeTimers();
  nativeRequests.length = 0;
  scrollHandlers.clear();
});

afterEach(() => {
  jest.useRealTimers();
});

afterAll(() => {
  browser.close();
  for (const [key, descriptor] of previousGlobals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

test('reconciles the published viewport with late native animation frames after watchdog fallback', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const published: GridViewport[] = [];
  const physicalOffsets: number[] = [];
  const items: readonly GridRectItem[] = [{ height: 20, id: 'far', width: 20, x: 10, y: 272 }];

  function Consumer() {
    return (
      <GridView
        contentHeight={1000}
        contentWidth={1000}
        focusedItemId="far"
        height={100}
        items={items}
        onViewportChange={(next) => {
          published.push(next);
        }}
        renderItem={() => null}
        testID="grid"
        viewportConstraints={{ world: { height: 1000, width: 1000, x: 0, y: 0 } }}
        width={100}
      />
    );
  }

  try {
    await React.act(() =>
      Promise.resolve().then(() => {
        root.render(<Consumer />);
      }),
    );
    expect(nativeRequests).toEqual([['y', 200, true]]);
    expect(published.map((viewport) => viewport.offsetY)).toEqual([200]);

    await dispatchNativeScrollAsync('grid-vertical-scroll', 40, physicalOffsets);
    await React.act(() =>
      Promise.resolve().then(() => {
        jest.advanceTimersByTime(700);
      }),
    );
    expect(published.map((viewport) => viewport.offsetY)).toEqual([200, 40]);

    await dispatchNativeScrollAsync('grid-vertical-scroll', 100, physicalOffsets);
    await dispatchNativeScrollAsync('grid-vertical-scroll', 200, physicalOffsets);
    await dispatchNativeScrollEndAsync('grid-vertical-scroll', 200, physicalOffsets);

    expect(physicalOffsets).toEqual([40, 100, 200, 200]);
    expect(published.map((viewport) => viewport.offsetY)).toEqual([200, 40, 100, 200]);
    expect(published.at(-1)?.offsetY).toBe(physicalOffsets.at(-1));
    expect(nativeRequests).toEqual([['y', 200, true]]);
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    await React.act(() =>
      Promise.resolve().then(() => {
        root.unmount();
      }),
    );
    host.remove();
  }
});

/*** Delivers one physical native scroll frame through the mounted GridView boundary. */
async function dispatchNativeScrollAsync(
  testID: string,
  offset: number,
  physicalOffsets: number[],
): Promise<void> {
  const handler = scrollHandlers.get(testID)?.onScroll;
  if (!handler) throw new Error(`Missing native scroll handler for ${testID}.`);
  physicalOffsets.push(offset);
  await React.act(() =>
    Promise.resolve().then(() => {
      handler(createNativeScrollEvent(offset));
    }),
  );
}

/*** Delivers the native momentum-end signal after the final physical offset is observed. */
async function dispatchNativeScrollEndAsync(
  testID: string,
  offset: number,
  physicalOffsets: number[],
): Promise<void> {
  const handler = scrollHandlers.get(testID)?.onMomentumScrollEnd;
  if (!handler) throw new Error(`Missing native scroll-end handler for ${testID}.`);
  physicalOffsets.push(offset);
  await React.act(() =>
    Promise.resolve().then(() => {
      handler(createNativeScrollEvent(offset));
    }),
  );
}

/*** Builds the native event shape GridView receives from either scroll axis. */
function createNativeScrollEvent(offset: number): NativeScrollEvent {
  return { nativeEvent: { contentOffset: { x: 0, y: offset } } };
}
