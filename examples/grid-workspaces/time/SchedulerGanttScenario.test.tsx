import { expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import type { ReactNode } from 'react';

const rootReact = await import('../../../node_modules/react/index.js');
const { act } = rootReact;
const { createRoot } = await import('../../../node_modules/react-dom/client.js');

mock.module('react', () => rootReact);

const reactNativeWeb = await import('react-native-web');
const FocusableTimeGrid = ({
  focusedIntervalId,
  onIntervalPress,
}: {
  readonly focusedIntervalId?: string;
  readonly onIntervalPress?: (interval: { readonly id: string }) => void;
}) =>
  focusedIntervalId ? (
    <button type="button" onClick={() => onIntervalPress?.({ id: focusedIntervalId })}>
      {focusedIntervalId}
    </button>
  ) : null;
const zora = {
  Button: ({
    children,
    onPress,
  }: {
    readonly children: ReactNode;
    readonly onPress: () => void;
  }) => (
    <button type="button" onClick={onPress}>
      {children}
    </button>
  ),
  ScreenSection: ({ children }: { readonly children: ReactNode }) => <>{children}</>,
  Text: ({ children }: { readonly children: ReactNode }) => <>{children}</>,
  TimeGrid: FocusableTimeGrid,
  View: ({ children }: { readonly children: ReactNode }) => <>{children}</>,
};

mock.module('react-native', () => ({
  ...reactNativeWeb,
  useWindowDimensions: () => ({ height: 844, width: 390 }),
}));
mock.module('@ankhorage/zora', () => zora);

const { SchedulerGanttScenario } = await import('./SchedulerGanttScenario');

test('reveals and selects the first virtualized Scheduler/Gantt interval on narrow viewports', async () => {
  const browser = new Window();
  const previous = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'].map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: browser,
    document: browser.document,
    Node: browser.Node,
    navigator: browser.navigator,
  });
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  try {
    await act(async () => {
      root.render(<SchedulerGanttScenario />);
    });
    expect(host.textContent).toContain('Selected interval: none');
    expect(findButton(host, 'research')).toBeUndefined();

    await act(async () => {
      findButton(host, 'Show first interval')?.dispatchEvent(
        new browser.MouseEvent('click', { bubbles: true }),
      );
    });
    expect(findButton(host, 'research')).toBeDefined();

    await act(async () => {
      findButton(host, 'research')?.dispatchEvent(
        new browser.MouseEvent('click', { bubbles: true }),
      );
    });
    expect(host.textContent).toContain('Selected interval: research');
  } finally {
    await act(async () => {
      root.unmount();
    });
    browser.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});

function findButton(host: HTMLElement, label: string) {
  return Array.from(host.querySelectorAll('button')).find((button) => button.textContent === label);
}
