import type { Core } from 'cytoscape';

import { expect, test } from 'bun:test';

import { createGraphResizeObserver } from './createGraphResizeObserver';

test('settles a pending initial fit only after the viewport becomes usable', () => {
  type ResizeEntry = {
    readonly contentRect: { readonly height: number; readonly width: number };
  };
  type ResizeCallback = (entries: readonly ResizeEntry[]) => void;

  const globals = globalThis as unknown as {
    ResizeObserver?: unknown;
    requestAnimationFrame?: (callback: () => void) => number;
  };
  const previousObserver = globals.ResizeObserver;
  const previousFrame = globals.requestAnimationFrame;
  let callback: ResizeCallback | null = null;
  let width = 0;
  let height = 0;
  const calls = { resize: 0, settle: 0, completedPending: [] as boolean[] };

  class FakeResizeObserver {
    constructor(next: ResizeCallback) {
      callback = next;
    }

    observe() {}

    disconnect() {}
  }

  globals.ResizeObserver = FakeResizeObserver;
  globals.requestAnimationFrame = (scheduled) => {
    scheduled();
    return 1;
  };

  const cy = {
    destroyed: () => false,
    height: () => height,
    resize: () => {
      calls.resize += 1;
    },
    width: () => width,
  } as unknown as Core;
  const pendingInitialFitRef = { current: false };
  const readyRef = { current: false };
  const layoutRunningRef = { current: false };

  try {
    const observer = createGraphResizeObserver({
      container: {},
      cy,
      settleViewport: () => {
        calls.settle += 1;
      },
      layoutRunningRef,
      pendingInitialFitRef,
      readyRef,
      onViewportSettled: (completedPendingInitialFit) => {
        calls.completedPending.push(completedPendingInitialFit);
      },
    });
    expect(observer).not.toBeNull();

    callback?.([{ contentRect: { height: 0, width: 0 } }]);
    expect(calls).toEqual({ resize: 0, settle: 0, completedPending: [] });

    pendingInitialFitRef.current = true;
    callback?.([{ contentRect: { height: 1, width: 1 } }]);
    expect(calls.resize).toBe(1);
    expect(calls.settle).toBe(0);
    expect(pendingInitialFitRef.current).toBe(true);

    width = 640;
    height = 480;
    callback?.([{ contentRect: { height, width } }]);

    expect(calls.resize).toBe(2);
    expect(calls.settle).toBe(1);
    expect(calls.completedPending).toEqual([true]);
    expect(pendingInitialFitRef.current).toBe(false);
  } finally {
    if (previousObserver === undefined) delete globals.ResizeObserver;
    else globals.ResizeObserver = previousObserver;
    if (previousFrame === undefined) delete globals.requestAnimationFrame;
    else globals.requestAnimationFrame = previousFrame;
  }
});
