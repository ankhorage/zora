import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { GraphViewController, GraphViewElementEvent } from '../../../../../types/graph-view';
import { GraphView } from './GraphView';

test('keeps a native double-press on the selected GraphView node without relayout', async () => {
  await withGraphBrowserAsync(async (browserWindow, host) => {
    const events: GraphViewElementEvent[] = [];
    const layouts: GraphViewController[] = [];
    const ready = Promise.withResolvers<GraphViewController>();
    const root = createRoot(host);
    const callbacks = {
      onLayoutComplete: (controller: GraphViewController) => layouts.push(controller),
      onNodeEvent: (event: GraphViewElementEvent) => events.push(event),
      onReady: ready.resolve,
    };
    const renderNode = ({
      node,
    }: {
      readonly node: { readonly id: string; readonly label?: string };
    }) => <button data-graph-node={node.id}>{node.label}</button>;
    const render = (selected: boolean) =>
      root.render(
        <GraphView
          edges={[]}
          getNodeSize={() => ({ height: 40, width: 80 })}
          layout="grid"
          nodes={[{ id: 'src', classes: selected ? 'selected' : undefined, label: 'src' }]}
          onLayoutComplete={callbacks.onLayoutComplete}
          onNodeEvent={callbacks.onNodeEvent}
          onReady={callbacks.onReady}
          renderNode={renderNode}
          styleRules={[
            { selector: 'node', style: { 'background-color': '#333333' } },
            { selector: 'node.selected', style: { 'background-color': '#ff0000' } },
          ]}
        />,
      );
    try {
      await interactAsync(() => render(false));
      const controller = await ready.promise;
      const before = controller.measureNodes?.(['src']);
      const viewport = controller.getViewport();
      const node = host.querySelector<HTMLButtonElement>('[data-graph-node="src"]');
      if (!node || before === undefined)
        throw new Error('Missing rendered GraphView node measurement.');

      await interactAsync(() =>
        node.dispatchEvent(
          new browserWindow.PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }),
        ),
      );
      await interactAsync(() => render(true));
      const selectedNode = host.querySelector<HTMLButtonElement>('[data-graph-node="src"]');
      if (!selectedNode) throw new Error('Selection update removed the GraphView node.');
      await interactAsync(() =>
        selectedNode.dispatchEvent(new browserWindow.MouseEvent('dblclick', { bubbles: true })),
      );

      expect(events.filter((event) => event.id === 'src' && event.type === 'press')).toHaveLength(
        1,
      );
      expect(
        events.filter((event) => event.id === 'src' && event.type === 'double-press'),
      ).toHaveLength(1);
      expect(controller.measureNodes?.(['src'])).toEqual(before);
      expect(controller.getViewport()).toEqual(viewport);
      expect(layouts.every((layout) => layout === controller)).toBe(true);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

async function withGraphBrowserAsync(
  assertion: (browserWindow: Window, host: HTMLDivElement) => Promise<void>,
) {
  const browserWindow = new Window();
  const keys = [
    'window',
    'document',
    'Node',
    'navigator',
    'HTMLElement',
    'HTMLCanvasElement',
    'CustomEvent',
    'getComputedStyle',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'IS_REACT_ACT_ENVIRONMENT',
  ] as const;
  const previous = keys.map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  const elementMetrics = ['clientHeight', 'clientWidth', 'offsetHeight', 'offsetWidth'] as const;
  const previousMetrics = elementMetrics.map(
    (key) =>
      [key, Object.getOwnPropertyDescriptor(browserWindow.HTMLElement.prototype, key)] as const,
  );
  const previousBoundingClientRect = Object.getOwnPropertyDescriptor(
    browserWindow.HTMLElement.prototype,
    'getBoundingClientRect',
  );
  const getComputedStyle = (element: Element) =>
    Reflect.apply(
      Reflect.get(Window.prototype, 'getComputedStyle') as (
        this: Window,
        target: Element,
      ) => unknown,
      browserWindow,
      [element],
    ) as CSSStyleDeclaration;
  const getComputedStyleWithZeroBoxMetrics = (element: Element) => {
    const style = getComputedStyle(element);
    return new Proxy(style, {
      get: (target, key) => {
        if (key !== 'getPropertyValue') return Reflect.get(target, key) as unknown;
        return (property: string) =>
          property.startsWith('padding') || property.startsWith('border')
            ? '0px'
            : target.getPropertyValue(property);
      },
    });
  };
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: browserWindow,
    document: browserWindow.document,
    Node: browserWindow.Node,
    navigator: browserWindow.navigator,
    HTMLElement: browserWindow.HTMLElement,
    HTMLCanvasElement: browserWindow.HTMLCanvasElement,
    CustomEvent: browserWindow.CustomEvent,
    getComputedStyle: getComputedStyleWithZeroBoxMetrics,
    requestAnimationFrame: browserWindow.requestAnimationFrame.bind(browserWindow),
    cancelAnimationFrame: browserWindow.cancelAnimationFrame.bind(browserWindow),
  });
  browserWindow.getComputedStyle = getComputedStyleWithZeroBoxMetrics;
  for (const [key, value] of [
    ['clientHeight', 600],
    ['clientWidth', 800],
    ['offsetHeight', 600],
    ['offsetWidth', 800],
  ] as const) {
    Object.defineProperty(browserWindow.HTMLElement.prototype, key, {
      configurable: true,
      get: () => value,
    });
  }
  Object.defineProperty(browserWindow.HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      bottom: 600,
      height: 600,
      left: 0,
      right: 800,
      top: 0,
      width: 800,
      x: 0,
      y: 0,
    }),
  });
  Object.defineProperty(browserWindow.HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: () => createCanvasContext(),
  });
  const host = document.createElement('div');
  document.body.appendChild(host);
  try {
    await assertion(browserWindow, host);
  } finally {
    browserWindow.close();
    for (const [key, descriptor] of previousMetrics) {
      if (descriptor) Object.defineProperty(browserWindow.HTMLElement.prototype, key, descriptor);
      else Reflect.deleteProperty(browserWindow.HTMLElement.prototype, key);
    }
    if (previousBoundingClientRect)
      Object.defineProperty(
        browserWindow.HTMLElement.prototype,
        'getBoundingClientRect',
        previousBoundingClientRect,
      );
    else Reflect.deleteProperty(browserWindow.HTMLElement.prototype, 'getBoundingClientRect');
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

function interactAsync(action: () => void) {
  return act(() => Promise.resolve().then(action));
}

/*** Provide the canvas API shape Cytoscape needs while Happy DOM exercises real browser events. */
function createCanvasContext() {
  const gradient = { addColorStop: () => undefined };
  return new Proxy(
    { canvas: { height: 600, width: 800 } },
    {
      get: (target, key) => {
        if (key in target) return target[key as keyof typeof target];
        if (key === 'measureText') return (text: string) => ({ width: text.length * 8 });
        if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => gradient;
        return () => undefined;
      },
      set: () => true,
    },
  );
}
