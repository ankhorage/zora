import { afterAll, expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

let mobilePresentation = false;

const browser = new Window();
const globals = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'] as const;
const previousGlobals = globals.map(
  (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
);
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  Node: browser.Node,
  document: browser.document,
  navigator: browser.navigator,
  window: browser,
});

const View = ({
  children,
  style,
  testID,
}: {
  children?: React.ReactNode;
  style?: object;
  testID?: string;
}) => (
  <div data-testid={testID} style={style}>
    {children}
  </div>
);

await mock.module('react-native', () => ({ ScrollView: View }));
await mock.module('../../../button/public', () => ({
  Button: ({ children, onPress }: { children?: React.ReactNode; onPress?: () => void }) => (
    <button onClick={onPress}>{children}</button>
  ),
  IconButton: ({ onPress }: { onPress?: () => void }) => <button onClick={onPress} />,
}));
await mock.module('../../../card/public', () => ({
  Card: ({
    actions,
    children,
    title,
  }: {
    actions?: React.ReactNode;
    children?: React.ReactNode;
    title?: React.ReactNode;
  }) => (
    <div>
      {title}
      {actions}
      {children}
    </div>
  ),
}));
await mock.module('../../../empty-state/public', () => ({ EmptyState: View }));
await mock.module('../../../form/checkbox/public', () => ({
  Checkbox: ({
    accessibilityLabel,
    checked,
    disabled,
    onCheckedChange,
  }: {
    accessibilityLabel?: string;
    checked?: boolean;
    disabled?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }) => (
    <button
      aria-checked={checked}
      aria-label={accessibilityLabel}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      role="checkbox"
    />
  ),
}));
await mock.module('../../../layout/public', () => ({ View }));
await mock.module('../../../popover-menu/public', () => ({ PopoverMenu: View }));
await mock.module('../../../skeleton/public', () => ({ SkeletonList: View }));
await mock.module('../../../theme/adapters/inbound/withZoraThemeScope', () => ({
  withZoraThemeScope: <P,>(Component: React.ComponentType<P>) => Component,
}));
await mock.module('../../../typography/public', () => ({
  Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
}));
await mock.module('@ankhorage/surface', () => ({
  Show: ({ children, fallback }: { children?: React.ReactNode; fallback?: React.ReactNode }) => (
    <>{mobilePresentation ? fallback : children}</>
  ),
}));

const { DataTable } = await import('./DataTable');

afterAll(() => {
  browser.close();
  for (const [key, descriptor] of previousGlobals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

/*** Renders DataTable against a DOM-backed primitive boundary. */
function mount() {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  return {
    host,
    render: (element: React.ReactNode) =>
      act(() => Promise.resolve().then(() => root.render(element))),
    unmount: () => act(() => Promise.resolve().then(() => root.unmount())),
  };
}

test('uses stable row identities for controlled checkbox and all-visible selection', async () => {
  const mounted = mount();
  const changes: string[][] = [];
  const onSelectedRowIdsChange = (selectedRowIds: readonly string[]) =>
    changes.push([...selectedRowIds]);

  try {
    await mounted.render(
      <DataTable
        columns={[{ accessor: 'name', header: 'Company', id: 'company' }]}
        onSelectedRowIdsChange={onSelectedRowIdsChange}
        rowKey="id"
        rows={[
          { id: 'acme', name: 'Acme' },
          { id: 'zora', name: 'ZORA' },
        ]}
        selectedRowIds={['acme']}
      />,
    );

    const zora = mounted.host.querySelector<HTMLButtonElement>('[aria-label="Select row zora"]');
    expect(zora?.getAttribute('role')).toBe('checkbox');
    expect(zora?.getAttribute('aria-checked')).toBe('false');
    zora?.click();
    expect(changes).toEqual([['acme', 'zora']]);

    const all = mounted.host.querySelector<HTMLButtonElement>(
      '[aria-label="Select all visible rows"]',
    );
    all?.click();
    expect(changes).toEqual([
      ['acme', 'zora'],
      ['acme', 'zora'],
    ]);

    await mounted.render(
      <DataTable
        columns={[{ accessor: 'name', header: 'Company', id: 'company' }]}
        onSelectedRowIdsChange={onSelectedRowIdsChange}
        rowKey="id"
        rows={[
          { id: 'zora', name: 'ZORA' },
          { id: 'acme', name: 'Acme' },
        ]}
        selectedRowIds={['acme', 'zora']}
      />,
    );
    expect(all?.getAttribute('aria-checked')).toBe('true');
    expect(mounted.host.textContent).not.toContain('Actions');
    expect(mounted.host.innerHTML).not.toContain('min-width: 720px');
    expect(mounted.host.innerHTML).not.toContain('min-width: 140px');
  } finally {
    await mounted.unmount();
    mounted.host.remove();
  }
});

test('keeps controlled selection visibly disabled in passive mode', async () => {
  const mounted = mount();
  const changes: string[][] = [];

  try {
    await mounted.render(
      <DataTable
        columns={[{ accessor: 'name', header: 'Company', id: 'company' }]}
        interactionPolicy="passive"
        onSelectedRowIdsChange={(selectedRowIds) => changes.push([...selectedRowIds])}
        rowKey="id"
        rows={[{ id: 'acme', name: 'Acme' }]}
        selectedRowIds={[]}
      />,
    );

    const checkbox = mounted.host.querySelector<HTMLButtonElement>(
      '[aria-label="Select row acme"]',
    );
    expect(checkbox?.disabled).toBe(true);
    checkbox?.click();
    expect(changes).toEqual([]);
  } finally {
    await mounted.unmount();
    mounted.host.remove();
  }
});

test('uses desktop stable row ids and the controlled callback in mobile cards', async () => {
  mobilePresentation = true;
  const mounted = mount();
  const changes: string[][] = [];

  try {
    await mounted.render(
      <DataTable
        columns={[
          { accessor: 'name', header: 'Company', id: 'company' },
          { accessor: 'location', header: 'Location', id: 'location' },
        ]}
        onSelectedRowIdsChange={(selectedRowIds) => changes.push([...selectedRowIds])}
        rowId={(row) => `company-${row.id}`}
        rows={[
          { id: 'acme', location: 'Zurich', name: 'Acme' },
          { id: 'zora', location: 'Bern', name: 'ZORA' },
        ]}
        selectedRowIds={['company-acme']}
      />,
    );

    const selected = mounted.host.querySelector<HTMLButtonElement>(
      '[aria-label="Select row company-acme"]',
    );
    const unselected = mounted.host.querySelector<HTMLButtonElement>(
      '[aria-label="Select row company-zora"]',
    );
    expect(selected?.getAttribute('aria-checked')).toBe('true');
    expect(unselected?.getAttribute('aria-checked')).toBe('false');

    unselected?.click();
    expect(changes).toEqual([['company-acme', 'company-zora']]);
  } finally {
    mobilePresentation = false;
    await mounted.unmount();
    mounted.host.remove();
  }
});
