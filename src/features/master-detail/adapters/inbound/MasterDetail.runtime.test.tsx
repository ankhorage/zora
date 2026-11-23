import type { UiNode } from '@ankhorage/contracts';
import { expect, mock, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const runtimeEnvironment: { breakpoint: 'base' | 'md' } = { breakpoint: 'md' };

await mock.module('@ankhorage/surface', () => ({
  Divider: () => <hr />,
  Grid: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  ScrollView: ({
    children,
    flex,
    minHeight,
    testID,
  }: React.PropsWithChildren<{
    readonly flex?: number;
    readonly minHeight?: number;
    readonly testID?: string;
  }>) => (
    <div data-flex={flex} data-min-height={minHeight} data-scroll={testID}>
      {children}
    </div>
  ),
  ThemeScope: ({ children }: React.PropsWithChildren) => children,
  View: ({
    children,
    flex,
    minHeight,
    minWidth,
    testID,
  }: React.PropsWithChildren<{
    readonly flex?: number;
    readonly minHeight?: number;
    readonly minWidth?: number;
    readonly testID?: string;
  }>) => (
    <div data-flex={flex} data-min-height={minHeight} data-min-width={minWidth} data-view={testID}>
      {children}
    </div>
  ),
  useBreakpoint: () => runtimeEnvironment.breakpoint,
}));

await mock.module('react-native', () => ({
  StyleSheet: { create: <T,>(styles: T) => styles },
  Text: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  View: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

const [{ RuntimeRenderer }, { MasterDetail }, { Screen }] = await Promise.all([
  import('@ankhorage/runtime'),
  import('./MasterDetail'),
  import('../../../layout/adapters/inbound/Screen'),
]);

const workspaceNode = {
  id: 'screen',
  type: 'Screen',
  props: { scroll: false, testID: 'screen' },
  children: [
    {
      id: 'workspace',
      type: 'MasterDetail',
      props: { activePane: 'master', masterWidth: 30, testID: 'workspace' },
      children: [
        { id: 'master', type: 'Text', props: { children: 'Master content' } },
        { id: 'detail', type: 'Text', props: { children: 'Detail content' } },
      ],
    },
  ],
} as const satisfies UiNode;

/*** Renders the serializable Runtime UiNode through the ZORA presentation boundary. */
function renderWorkspace(node: UiNode): string {
  return renderToStaticMarkup(
    <RuntimeRenderer
      isRoot
      node={node}
      registry={{
        MasterDetail,
        Screen,
        Text: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
      }}
    />,
  );
}

test('renders both serializable MasterDetail children through RuntimeRenderer in a bounded 30/70 Screen', () => {
  runtimeEnvironment.breakpoint = 'md';
  const markup = renderWorkspace(workspaceNode);

  expect(markup).toContain('Master content');
  expect(markup).toContain('Detail content');
  expect(markup).toContain('data-flex="30"');
  expect(markup).toContain('data-flex="70"');
  expect(markup).toContain('data-scroll="workspace-master"');
  expect(markup).toContain('data-scroll="workspace-detail"');
  expect(markup.match(/data-scroll=/gu)).toHaveLength(2);
  expect(markup).toContain('data-min-height="0"');
  expect(markup).toContain('data-view="screen"');
  expect(markup).toContain('data-min-width="0"');
});

test('projects the same Runtime children through host-owned compact pane state', () => {
  runtimeEnvironment.breakpoint = 'base';
  const markup = renderWorkspace({
    ...workspaceNode,
    children: [
      {
        ...workspaceNode.children[0],
        props: { ...workspaceNode.children[0].props, activePane: 'detail' },
      },
    ],
  });

  expect(markup).not.toContain('Master content');
  expect(markup).toContain('Detail content');
  expect(markup).toContain('data-scroll="workspace-detail"');
  expect(markup).not.toContain('data-scroll="workspace-master"');
});
