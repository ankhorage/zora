import type { Core } from 'cytoscape';

import { scheduleGraphFrame } from './scheduleGraphFrame';

interface CreateGraphResizeObserverInput {
  readonly container: unknown;
  readonly cy: Core;
  readonly settleViewport: () => void;
  readonly layoutRunningRef: { current: boolean };
  readonly readyRef: { current: boolean };
  readonly onViewportSettled: () => void;
}

export interface GraphResizeObserver {
  disconnect(): void;
}

/*** Observe settled container resizing without racing an active layout generation. */
export function createGraphResizeObserver(
  input: CreateGraphResizeObserverInput,
): GraphResizeObserver | null {
  const Observer = readResizeObserverConstructor();
  if (Observer === null) return null;
  const sizeRef = { height: -1, width: -1 };

  const observer = new Observer((entries) => {
    const entry = entries.at(0);
    if (entry === undefined || !hasSizeChanged(sizeRef, entry.contentRect)) return;
    sizeRef.height = entry.contentRect.height;
    sizeRef.width = entry.contentRect.width;
    if (!input.readyRef.current || input.layoutRunningRef.current) return;
    scheduleResizeFit(input);
  });
  observer.observe(input.container);
  return observer;
}

/*** Fit one genuine resize only after the active layout has settled. */
function scheduleResizeFit(input: CreateGraphResizeObserverInput) {
  scheduleGraphFrame(() => {
    if (input.cy.destroyed() || input.layoutRunningRef.current) return;
    input.cy.resize();
    input.settleViewport();
    input.onViewportSettled();
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
