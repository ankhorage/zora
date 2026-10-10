import {
  type GridPoint,
  type GridRect,
  type GridResizeHandle,
  hitTestWorldRects,
  moveWorldRects,
  panViewport,
  resizeWorldRect,
  resolveWorldSnapCandidate,
  selectWorldRects,
  viewportToWorld,
} from '@ankhorage/grid-view';

import type {
  GridInteractionIntent,
  GridInteractionItem,
  GridInteractionPointer,
  GridInteractionsController,
  GridInteractionsControllerProps,
} from '../../../types/grid-interactions';

type InteractionState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'marquee'; readonly start: GridPoint }
  | { readonly kind: 'pan'; readonly start: GridPoint }
  | { readonly kind: 'move'; readonly start: GridPoint; readonly itemIds: readonly string[] }
  | {
      readonly kind: 'resize';
      readonly start: GridPoint;
      readonly item: GridInteractionItem;
      readonly handle: GridResizeHandle;
    };

/*** Create a platform-neutral controlled interaction controller using grid-view geometry only. */
export function createGridInteractionsController(
  props: GridInteractionsControllerProps,
): GridInteractionsController {
  let state: InteractionState = { kind: 'idle' };
  let previousIntent: GridInteractionIntent | undefined;
  const point = (pointer: GridInteractionPointer) =>
    Number.isFinite(pointer.x) && Number.isFinite(pointer.y)
      ? viewportToWorld(pointer, props.viewport)
      : undefined;
  const protectedItem = (item: GridInteractionItem) =>
    item.disabled === true ||
    item.locked === true ||
    item.readOnly === true ||
    item.passive === true;
  const emit = (intent: GridInteractionIntent) => {
    if (JSON.stringify(previousIntent) === JSON.stringify(intent)) return;
    previousIntent = intent;
    props.onIntent(intent);
  };

  return {
    begin: (pointer, handle) => {
      const start = point(pointer);
      if (start === undefined) return;
      if (pointer.spaceKey === true || pointer.altKey === true) {
        state = { kind: 'pan', start };
        return;
      }
      const target = hitTestWorldRects(props.items, start);
      if (target === undefined || protectedItem(target)) {
        state = { kind: 'marquee', start };
        return;
      }
      if (handle !== undefined && target.resizable !== false) {
        state = { kind: 'resize', start, item: target, handle };
        return;
      }
      const itemIds =
        props.selectedIds?.includes(target.id) === true ? props.selectedIds : [target.id];
      state = { kind: 'move', start, itemIds };
    },
    move: (pointer) => {
      const current = point(pointer);
      if (current !== undefined) emitPreview(state, current, props, emit);
    },
    end: (pointer) => {
      const current = point(pointer);
      if (current !== undefined) emitPreview(state, current, props, emit);
      state = { kind: 'idle' };
    },
    cancel: () => {
      state = { kind: 'idle' };
    },
    keyDown: (key, pointer = { x: 0, y: 0 }) => {
      const focusedId = props.selectedIds?.at(-1);
      const focused = props.items.find((item) => item.id === focusedId);
      if (!focused || isProtected(focused)) return false;
      const increment = pointer.shiftKey === true ? 10 : 1;
      const delta = keyToDelta(key, increment);
      if (delta === undefined) return false;
      if (pointer.altKey === true) {
        emit({
          type: 'resize',
          itemIds: [focused.id],
          rects: [resizeWorldRect(focused, resizeHandleForDelta(delta), delta)],
        });
        return true;
      }
      emit({ type: 'move', itemIds: [focused.id], rects: moveWorldRects([focused], delta) });
      return true;
    },
  };
}

/*** Emit one controlled preview/intention without retaining or mutating caller-owned item data. */
function emitPreview(
  state: InteractionState,
  current: GridPoint,
  props: GridInteractionsControllerProps,
  emit: (intent: GridInteractionIntent) => void,
) {
  if (state.kind === 'idle') return;
  if (state.kind === 'pan') {
    emit({
      type: 'pan',
      itemIds: [],
      viewport: panViewport(props.viewport, {
        x: state.start.x - current.x,
        y: state.start.y - current.y,
      }),
    });
    return;
  }
  if (state.kind === 'marquee') {
    const marquee = normalizeRect(state.start, current);
    const itemIds = selectWorldRects(props.items, marquee, {
      mode: props.marqueeMode ?? 'intersect',
    }).filter((id) => {
      const item = props.items.find((candidate) => candidate.id === id);
      return item !== undefined && !isProtected(item);
    });
    emit({ type: 'marquee', itemIds, marquee });
    return;
  }
  const delta = resolveSnapDelta(state, current, props);
  if (state.kind === 'move') {
    const selected = props.items.filter((item) => state.itemIds.includes(item.id));
    emit({ type: 'move', itemIds: state.itemIds, rects: moveWorldRects(selected, delta) });
    return;
  }
  emit({
    type: 'resize',
    itemIds: [state.item.id],
    rects: [resizeWorldRect(state.item, state.handle, delta)],
  });
}

/*** Resolve explicit per-axis candidate snapping without inventing geometry outside grid-view. */
function resolveSnapDelta(
  state: InteractionState,
  current: GridPoint,
  props: GridInteractionsControllerProps,
): GridPoint {
  if (state.kind === 'idle' || state.kind === 'marquee' || state.kind === 'pan') {
    return { x: 0, y: 0 };
  }
  const raw = { x: current.x - state.start.x, y: current.y - state.start.y };
  if (props.snap?.enabled !== true) return raw;
  const anchor =
    state.kind === 'resize' ? state.item : props.items.find((item) => item.id === state.itemIds[0]);
  if (anchor === undefined) return raw;
  const options = {
    enabled: true,
    tolerancePixels: props.snap.tolerancePixels,
    priorities: props.snap.priorities,
  };
  return {
    x:
      resolveWorldSnapCandidate(anchor.x + raw.x, props.snap.x ?? [], {
        ...options,
        pixelsPerUnit: props.viewport.pixelsPerUnitX,
      }) - anchor.x,
    y:
      resolveWorldSnapCandidate(anchor.y + raw.y, props.snap.y ?? [], {
        ...options,
        pixelsPerUnit: props.viewport.pixelsPerUnitY,
      }) - anchor.y,
  };
}

/*** Keep all caller-declared protected items out of selection and edit intents. */
function isProtected(item: GridInteractionItem): boolean {
  return (
    item.disabled === true ||
    item.locked === true ||
    item.readOnly === true ||
    item.passive === true
  );
}

/*** Normalize an arbitrary-direction drag into the world rectangle expected by grid-view selection. */
function normalizeRect(start: GridPoint, end: GridPoint): GridRect {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

/** Maps accessible arrow keys to caller-controlled world-space edit increments. */
function keyToDelta(key: string, increment: number): GridPoint | undefined {
  if (key === 'ArrowUp') return { x: 0, y: -increment };
  if (key === 'ArrowRight') return { x: increment, y: 0 };
  if (key === 'ArrowDown') return { x: 0, y: increment };
  if (key === 'ArrowLeft') return { x: -increment, y: 0 };
  return undefined;
}

/** Chooses the physical edge matching an accessible resize direction. */
function resizeHandleForDelta(delta: GridPoint): GridResizeHandle {
  if (delta.x < 0) return delta.y < 0 ? 'top-left' : delta.y > 0 ? 'bottom-left' : 'left';
  return delta.y < 0 ? 'top-right' : delta.y > 0 ? 'bottom-right' : 'right';
}
