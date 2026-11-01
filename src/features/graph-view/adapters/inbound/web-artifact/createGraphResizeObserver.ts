import type { Core } from 'cytoscape';

import { scheduleGraphFrame } from './scheduleGraphFrame';

interface CreateGraphResizeObserverInput {
  readonly container: unknown;
  readonly cy: Core;
  readonly beginViewportResize: () => void;
  readonly settleViewport: (fit: boolean) => void;
  readonly layoutRunningRef: { current: boolean };
  readonly pendingInitialFitRef: { current: boolean };
  readonly readyRef: { current: boolean };
  readonly onViewportSettled: (completedPendingInitialFit: boolean) => void;
}

export interface GraphResizeObserver {
  disconnect(): void;
  flushAfterLayout(): void;
}

/*** Observe settled container resizing without racing an active layout generation. */
export function createGraphResizeObserver(
  input: CreateGraphResizeObserverInput,
): GraphResizeObserver | null {
  const Observer = readResizeObserverConstructor();
  if (Observer === null) return null;
  const sizeRef = { height: -1, width: -1 };
  const pendingLayoutResizeRef = { current: false };
  const pendingResizeSnapshotRef = { current: false };
  const resizeScheduledRef = { current: false };

  const observer = new Observer((entries) => {
    const entry = entries.at(0);
    if (entry === undefined || !hasSizeChanged(sizeRef, entry.contentRect)) return;
    sizeRef.height = entry.contentRect.height;
    sizeRef.width = entry.contentRect.width;
    if (!input.readyRef.current && !input.pendingInitialFitRef.current) return;
    captureResizeSnapshot(input, pendingResizeSnapshotRef);
    if (input.layoutRunningRef.current) {
      pendingLayoutResizeRef.current = true;
      return;
    }
    scheduleResizeFit(input, pendingLayoutResizeRef, pendingResizeSnapshotRef, resizeScheduledRef);
  });
  observer.observe(input.container);
  return {
    disconnect: () => observer.disconnect(),
    flushAfterLayout: () =>
      flushAfterLayout(input, pendingLayoutResizeRef, pendingResizeSnapshotRef),
  };
}

/*** Keep the first pre-resize viewport intent until its resize or layout settlement consumes it. */
function captureResizeSnapshot(
  input: CreateGraphResizeObserverInput,
  pendingResizeSnapshotRef: { current: boolean },
) {
  if (pendingResizeSnapshotRef.current) return;
  input.beginViewportResize();
  pendingResizeSnapshotRef.current = true;
}

/*** Apply a resize observed during layout before that layout settles the preserved viewport. */
function flushAfterLayout(
  input: CreateGraphResizeObserverInput,
  pendingLayoutResizeRef: { current: boolean },
  pendingResizeSnapshotRef: { current: boolean },
) {
  if (!pendingLayoutResizeRef.current || input.cy.destroyed() || input.layoutRunningRef.current)
    return;
  pendingLayoutResizeRef.current = false;
  pendingResizeSnapshotRef.current = false;
  input.cy.resize();
}

/*** Preserve settled viewport intent across one coalesced resize, except the deferred initial fit. */
function scheduleResizeFit(
  input: CreateGraphResizeObserverInput,
  pendingLayoutResizeRef: { current: boolean },
  pendingResizeSnapshotRef: { current: boolean },
  resizeScheduledRef: { current: boolean },
) {
  if (resizeScheduledRef.current) return;
  resizeScheduledRef.current = true;
  scheduleGraphFrame(() => {
    resizeScheduledRef.current = false;
    if (input.cy.destroyed()) return;
    if (input.layoutRunningRef.current) {
      pendingLayoutResizeRef.current = true;
      return;
    }
    input.cy.resize();
    if (input.cy.width() <= 0 || input.cy.height() <= 0) return;
    pendingResizeSnapshotRef.current = false;
    const completedPendingInitialFit = input.pendingInitialFitRef.current;
    input.pendingInitialFitRef.current = false;
    input.settleViewport(completedPendingInitialFit);
    input.onViewportSettled(completedPendingInitialFit);
  });
}

/*** Return whether ResizeObserver reported a genuinely different container size. */
function hasSizeChanged(
  previous: { readonly height: number; readonly width: number },
  next: { readonly height: number; readonly width: number },
): boolean {
  return previous.height !== next.height || previous.width !== next.width;
}

/*** Read ResizeObserver without imposing DOM library types on the package target. */
function readResizeObserverConstructor(): ResizeObserverConstructorLike | null {
  const value = (
    globalThis as unknown as {
      ResizeObserver?: ResizeObserverConstructorLike;
    }
  ).ResizeObserver;
  return value ?? null;
}

interface ResizeObserverEntryLike {
  readonly contentRect: {
    readonly height: number;
    readonly width: number;
  };
}

interface ResizeObserverLike extends GraphResizeObserver {
  observe(target: unknown): void;
}

type ResizeObserverConstructorLike = new (
  callback: (entries: readonly ResizeObserverEntryLike[]) => void,
) => ResizeObserverLike;
