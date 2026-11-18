// Exercises the native adapters through their React Native callback boundary. The module mocks
// are process-wide in Bun, so this file relies on the repository's isolated test execution.
import type { FlowNode } from '@ankhorage/contracts/flow';
import { afterAll, beforeEach, expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

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

interface NativePressableProps {
  readonly accessibilityLabel?: string;
  readonly accessibilityState?: Readonly<{ disabled?: boolean; selected?: boolean }>;
  readonly children?: React.ReactNode;
  readonly disabled?: boolean;
  readonly onFocus?: () => void;
  readonly onLongPress?: () => void;
  readonly onPress?: () => void;
  readonly testID?: string;
}

interface BottomSheetRecord {
  readonly children: React.ReactNode;
  readonly dismissOnBackdropPress?: boolean;
  readonly enablePanDownToClose?: boolean;
  readonly keyboardBehavior?: 'extend' | 'fillParent' | 'interactive';
  readonly keyboardBlurBehavior?: 'none' | 'restore';
  readonly onDismiss?: () => void;
  readonly open?: boolean;
}

interface NativeTextInputProps {
  readonly accessibilityLabel?: string;
  readonly disabled?: boolean;
  readonly onChangeText?: (value: string) => void;
  readonly value?: string;
}

const bottomSheets: BottomSheetRecord[] = [];
const nativeTextInputs: NativeTextInputProps[] = [];

await mock.module('react-native', () => ({
  Platform: { OS: 'ios' },
  Pressable: ({
    accessibilityLabel,
    accessibilityState,
    children,
    disabled,
    onFocus,
    onLongPress,
    onPress,
    testID,
  }: NativePressableProps) => (
    <button
      aria-label={accessibilityLabel}
      aria-selected={accessibilityState?.selected}
      data-testid={testID}
      disabled={disabled}
      onClick={onPress}
      onContextMenu={(event) => {
        event.preventDefault();
        onLongPress?.();
      }}
      onFocus={onFocus}
      type="button"
    >
      {children}
    </button>
  ),
}));

await mock.module(new URL('./bottom-sheet/public.ts', import.meta.url).pathname, () => ({
  BottomSheet: ({ children, ...props }: BottomSheetRecord) => {
    bottomSheets.push({ children, ...props });
    return null;
  },
}));
await mock.module(new URL('./card/public.ts', import.meta.url).pathname, () => ({
  Card: ({ children }: { readonly children?: React.ReactNode }) => <div>{children}</div>,
}));
await mock.module(new URL('./layout/public.ts', import.meta.url).pathname, () => ({
  View: ({ children }: { readonly children?: React.ReactNode }) => <div>{children}</div>,
}));
await mock.module(new URL('./typography/public.ts', import.meta.url).pathname, () => ({
  Heading: ({ children }: { readonly children?: React.ReactNode }) => <h2>{children}</h2>,
  Text: ({ children }: { readonly children?: React.ReactNode }) => <span>{children}</span>,
}));
await mock.module(new URL('./form/public.ts', import.meta.url).pathname, () => ({
  Field: ({ children }: { readonly children?: React.ReactNode }) => <label>{children}</label>,
}));
await mock.module(new URL('./form/text-input/public.ts', import.meta.url).pathname, () => ({
  TextInput: (props: NativeTextInputProps) => {
    nativeTextInputs.push(props);
    return (
      <input
        aria-label={props.accessibilityLabel}
        disabled={props.disabled}
        readOnly
        value={props.value}
      />
    );
  },
}));
await mock.module(new URL('./badge/public.ts', import.meta.url).pathname, () => ({
  Badge: ({ children }: { readonly children?: React.ReactNode }) => <span>{children}</span>,
}));
await mock.module(new URL('./progress/public.ts', import.meta.url).pathname, () => ({
  Progress: () => <progress />,
}));
await mock.module(
  new URL('./theme/adapters/inbound/withZoraThemeScope.tsx', import.meta.url).pathname,
  () => ({
    withZoraThemeScope: <P,>(Component: (props: P) => React.ReactElement | null) => Component,
  }),
);
await mock.module(new URL('./theme/composition/useZoraTheme.ts', import.meta.url).pathname, () => ({
  useZoraTheme: () => ({
    theme: { colors: { primary: '#000' }, semantics: { neutral: { divider: '#000' } } },
  }),
}));

const { FlowInspector } = await import('./flow-inspector/public');
const { FlowNodePalette } = await import('./flow-node-palette/public');
const { FlowExecutionOverlay } = await import('./flow-execution-overlay/public');

beforeEach(() => {
  bottomSheets.length = 0;
  nativeTextInputs.length = 0;
});

afterAll(() => {
  browser.close();
  for (const [key, descriptor] of previousGlobals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

test('keeps native outline selection and bottom-sheet dismissal controlled by the host', async () => {
  const mounted = mount();
  const selections: (string | null)[] = [];
  try {
    await mounted.render(
      <FlowInspector
        node={node}
        onNodeSelectionChange={(selection) => selections.push(selection)}
        outline={[
          { id: 'first', title: 'First node' },
          { id: 'second', title: 'Second node' },
        ]}
        selectedNodeId="first"
      />,
    );

    await mounted.click('Second node');
    expect(selections).toEqual(['second']);
    expect(bottomSheets).toHaveLength(1);
    expect(bottomSheets[0]).toMatchObject({
      dismissOnBackdropPress: true,
      enablePanDownToClose: true,
      keyboardBehavior: 'interactive',
      keyboardBlurBehavior: 'restore',
      open: true,
    });

    bottomSheets[0]?.onDismiss?.();
    expect(selections).toEqual(['second', null]);

    await mounted.render(
      <FlowInspector
        disabled
        node={node}
        onNodeSelectionChange={(selection) => selections.push(selection)}
        outline={[{ id: 'third', title: 'Third node' }]}
      />,
    );
    const disabledOutlineItem = mounted.button('Third node');
    if (!disabledOutlineItem) throw new Error('Missing disabled outline item.');
    expect(disabledOutlineItem.disabled).toBe(true);
    await mounted.click('Third node');
    expect(selections).toEqual(['second', null]);
  } finally {
    await mounted.unmount();
  }
});

test('sends typed inspector changes through the controlled native callbacks', async () => {
  const mounted = mount();
  const values: unknown[] = [];
  try {
    await mounted.render(
      <FlowInspector
        fields={[
          { id: 'retries', kind: 'number', label: 'Retries' },
          { id: 'enabled', kind: 'boolean', label: 'Enabled' },
          {
            id: 'mode',
            kind: 'select',
            label: 'Mode',
            options: [
              { label: 'Safe', value: 'safe' },
              { label: 'Fast', value: 'fast' },
            ],
          },
        ]}
        node={node}
        onValueChange={(fieldId, value) => values.push([fieldId, value])}
      />,
    );
    await mounted.renderSheet();

    nativeTextInputs[0]?.onChangeText?.('2');
    await mounted.click('Enabled');
    await mounted.click('Mode');

    expect(values).toEqual([
      ['retries', { kind: 'inline', value: 2 }],
      ['enabled', { kind: 'inline', value: true }],
      ['mode', { kind: 'inline', value: 'safe' }],
    ]);
  } finally {
    await mounted.unmount();
  }
});

test('uses native palette presses and execution rows as controlled callbacks', async () => {
  const mounted = mount();
  const inserted: string[] = [];
  const selected: string[] = [];
  const steps: string[] = [];
  try {
    await mounted.render(
      <>
        <FlowNodePalette
          items={[{ id: 'send', title: 'Send message' }]}
          onInsert={(itemId) => inserted.push(itemId)}
          onSelectionChange={(itemId) => selected.push(itemId ?? '')}
        />
        {(['pending', 'running', 'waiting_for_approval', 'succeeded', 'failed'] as const).map(
          (status) => (
            <FlowExecutionOverlay
              key={status}
              onStepPress={status === 'pending' ? (step) => steps.push(step.id) : undefined}
              status={status}
              steps={
                status === 'pending'
                  ? [{ attempt: 1, id: 'step-1', nodeId: 'send', status: 'succeeded' }]
                  : []
              }
            />
          ),
        )}
      </>,
    );

    await mounted.click('Send message');
    await mounted.click('send, completed');

    expect(inserted).toEqual(['send']);
    expect(selected).toEqual(['send']);
    expect(steps).toEqual(['step-1']);
    expect(mounted.text()).toContain('idle');
    expect(mounted.text()).toContain('running');
    expect(mounted.text()).toContain('waiting for approval');
    expect(mounted.text()).toContain('completed');
    expect(mounted.text()).toContain('failed');
  } finally {
    await mounted.unmount();
  }
});

/** Mounts native-adapter output in a DOM host while preserving React Native callback semantics. */
function mount() {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  return {
    button: (label: string) => findButton(host, label),
    click: async (label: string) => {
      const button = findButton(host, label);
      if (!button) throw new Error(`Missing button ${label}.`);
      await act(() => Promise.resolve().then(() => button.click()));
    },
    render: (element: React.ReactNode) =>
      act(() => Promise.resolve().then(() => root.render(element))),
    renderSheet: () =>
      act(() => Promise.resolve().then(() => root.render(bottomSheets.at(-1).children))),
    text: () => host.textContent,
    unmount: async () => {
      await act(() => Promise.resolve().then(() => root.unmount()));
      host.remove();
    },
  };
}

/** Finds the visible native button whose children contain the requested user-facing text. */
function findButton(host: HTMLElement, label: string): HTMLButtonElement | null {
  return [...host.querySelectorAll('button')].find(
    (button) => button.getAttribute('aria-label') === label || button.textContent === label,
  );
}

const node: FlowNode = {
  capability: { capabilityId: 'send', providerId: 'example' },
  config: { enabled: { kind: 'inline', value: false } },
  id: 'send',
  ports: [],
};
