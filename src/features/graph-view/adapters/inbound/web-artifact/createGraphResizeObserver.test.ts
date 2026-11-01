import { expect, test } from 'bun:test';
import type { Core } from 'cytoscape';

import { createGraphResizeObserver } from './createGraphResizeObserver';

test('settles a pending initial fit only after the viewport becomes usable', () => {
  interface ResizeEntry {
    readonly contentRect: { readonly height: number; readonly width: number };
  }
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
  const calls = { resize: 0, settle: [] as boolean[], completedPending: [] as boolean[] };
  const observerCalls = { disconnect: 0, observe: 0 };

  class FakeResizeObserver {
    constructor(next: ResizeCallback) {
      callback = next;
    }

    observe() {
      observerCalls.observe += 1;
    }

    disconnect() {
      observerCalls.disconnect += 1;
    }
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
      beginViewportResize: () => undefined,
      settleViewport: (fit) => {
        calls.settle.push(fit);
      },
      layoutRunningRef,
      pendingInitialFitRef,
      readyRef,
      onViewportSettled: (completedPendingInitialFit) => {
        calls.completedPending.push(completedPendingInitialFit);
      },
    });
    expect(observer).not.toBeNull();
    expect(observerCalls.observe).toBe(1);

    callback?.([{ contentRect: { height: 0, width: 0 } }]);
    expect(calls).toEqual({ resize: 0, settle: [], completedPending: [] });

    pendingInitialFitRef.current = true;
    callback?.([{ contentRect: { height: 1, width: 1 } }]);
    expect(calls.resize).toBe(1);
    expect(calls.settle).toEqual([]);
    expect(pendingInitialFitRef.current).toBe(true);

    width = 640;
    height = 480;
    callback?.([{ contentRect: { height, width } }]);

    expect(calls.resize).toBe(2);
    expect(calls.settle).toEqual([true]);
    expect(calls.completedPending).toEqual([true]);
    expect(pendingInitialFitRef.current).toBe(false);

    observer?.disconnect();
    expect(observerCalls.disconnect).toBe(1);
  } finally {
    if (previousObserver === undefined) delete globals.ResizeObserver;
    else globals.ResizeObserver = previousObserver;
    if (previousFrame === undefined) delete globals.requestAnimationFrame;
    else globals.requestAnimationFrame = previousFrame;
  }
});

test('preserves the settled viewport on ordinary resizes', () => {
  interface ResizeEntry {
    readonly contentRect: { readonly height: number; readonly width: number };
  }
  type ResizeCallback = (entries: readonly ResizeEntry[]) => void;

  const globals = globalThis as unknown as {
    ResizeObserver?: unknown;
    requestAnimationFrame?: (callback: () => void) => number;
  };
  const previousObserver = globals.ResizeObserver;
  const previousFrame = globals.requestAnimationFrame;
  let callback: ResizeCallback | null = null;
  const calls = { settle: [] as boolean[] };
  const frames: (() => void)[] = [];

  class FakeResizeObserver {
    constructor(next: ResizeCallback) {
      callback = next;
    }

    observe() {
      return undefined;
    }

    disconnect() {
      return undefined;
    }
  }

  globals.ResizeObserver = FakeResizeObserver;
  globals.requestAnimationFrame = (scheduled) => {
    frames.push(scheduled);
    return frames.length;
  };

  try {
    createGraphResizeObserver({
      container: {},
      cy: {
        destroyed: () => false,
        height: () => 480,
        resize: () => undefined,
        width: () => 640,
      } as unknown as Core,
      beginViewportResize: () => undefined,
      settleViewport: (fit) => calls.settle.push(fit),
      layoutRunningRef: { current: false },
      pendingInitialFitRef: { current: false },
      readyRef: { current: true },
      onViewportSettled: () => undefined,
    });

    callback?.([{ contentRect: { height: 480, width: 640 } }]);
    callback?.([{ contentRect: { height: 600, width: 800 } }]);
    expect(frames).toHaveLength(1);
    frames[0]?.();
    expect(calls.settle).toEqual([false]);
  } finally {
    if (previousObserver === undefined) delete globals.ResizeObserver;
    else globals.ResizeObserver = previousObserver;
    if (previousFrame === undefined) delete globals.requestAnimationFrame;
    else globals.requestAnimationFrame = previousFrame;
  }
});

test('carries one resize snapshot through an active layout for its completion to settle', () => {
  interface ResizeEntry {
    readonly contentRect: { readonly height: number; readonly width: number };
  }
  type ResizeCallback = (entries: readonly ResizeEntry[]) => void;

  const globals = globalThis as unknown as { ResizeObserver?: unknown };
  const previousObserver = globals.ResizeObserver;
  let callback: ResizeCallback | null = null;
  const calls = { begin: 0, resize: 0, settle: 0 };
  const layoutRunningRef = { current: true };

  class FakeResizeObserver {
    constructor(next: ResizeCallback) {
      callback = next;
    }

    observe() {
      return undefined;
    }

    disconnect() {
      return undefined;
    }
  }

  globals.ResizeObserver = FakeResizeObserver;
  try {
    const observer = createGraphResizeObserver({
      container: {},
      cy: {
        destroyed: () => false,
        height: () => 480,
        resize: () => {
          calls.resize += 1;
        },
        width: () => 640,
      } as unknown as Core,
      beginViewportResize: () => {
        calls.begin += 1;
      },
      settleViewport: () => {
        calls.settle += 1;
      },
      layoutRunningRef,
      pendingInitialFitRef: { current: false },
      readyRef: { current: true },
      onViewportSettled: () => undefined,
    });

    callback?.([{ contentRect: { height: 480, width: 640 } }]);
    callback?.([{ contentRect: { height: 600, width: 800 } }]);
    expect(calls).toEqual({ begin: 1, resize: 0, settle: 0 });

    layoutRunningRef.current = false;
    observer?.flushAfterLayout();
    expect(calls).toEqual({ begin: 1, resize: 1, settle: 0 });
  } finally {
    if (previousObserver === undefined) delete globals.ResizeObserver;
    else globals.ResizeObserver = previousObserver;
  }
});
