import {
  type GridPoint,
  type GridRect,
  type GridResizeHandle,
  type GridViewport,
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
  | { readonly kind: 'marquee'; readonly start: GridPoint; readonly viewport: GridViewport }
  | { readonly kind: 'pan'; readonly start: GridPoint; readonly viewport: GridViewport }
  | {
      readonly kind: 'move';
      readonly start: GridPoint;
      readonly viewport: GridViewport;
      readonly itemIds: readonly string[];
      readonly items: readonly GridInteractionItem[];
    }
  | {
      readonly kind: 'resize';
      readonly start: GridPoint;
      readonly viewport: GridViewport;
      readonly item: GridInteractionItem;
      readonly handle: GridResizeHandle;
    };

/*** Create a platform-neutral controlled interaction controller using grid-view geometry only. */
export function createGridInteractionsController(
  props: GridInteractionsControllerProps,
): GridInteractionsController {
  let currentProps = props;
  let state: InteractionState = { kind: 'idle' };
  let previousIntent: GridInteractionIntent | undefined;
  const point = (pointer: GridInteractionPointer, viewport = currentProps.viewport) =>
    Number.isFinite(pointer.x) && Number.isFinite(pointer.y)
      ? viewportToWorld(pointer, viewport)
      : undefined;
  const emit = (intent: GridInteractionIntent) => {
    if (JSON.stringify(previousIntent) === JSON.stringify(intent)) return;
    previousIntent = intent;
    currentProps.onIntent(intent);
  };

  return {
    begin: (pointer, handle) => {
      if (!canEdit(currentProps)) return;
      const start = point(pointer);
      if (start === undefined) return;
      if (pointer.spaceKey === true || pointer.altKey === true) {
        state = { kind: 'pan', start, viewport: currentProps.viewport };
        return;
      }
      const target = hitTestWorldRects(currentProps.items, start);
      if (target === undefined || isProtected(target)) {
        state = { kind: 'marquee', start, viewport: currentProps.viewport };
        return;
      }
      if (handle !== undefined && target.resizable !== false) {
        state = { kind: 'resize', start, viewport: currentProps.viewport, item: target, handle };
        return;
      }
      const itemIds =
        currentProps.selectedIds?.includes(target.id) === true
          ? currentProps.selectedIds
          : [target.id];
      state = {
        kind: 'move',
        start,
        viewport: currentProps.viewport,
        itemIds,
        items: currentProps.items.filter((item) => itemIds.includes(item.id)),
      };
    },
    move: (pointer) => {
      if (!canEdit(currentProps)) return;
      const current = point(pointer, viewportForState(state, currentProps.viewport));
      if (current !== undefined) emitPreview(state, current, currentProps, emit);
    },
    end: (pointer) => {
      if (!canEdit(currentProps)) {
        state = { kind: 'idle' };
        return;
      }
      const current = point(pointer, viewportForState(state, currentProps.viewport));
      if (current !== undefined) emitPreview(state, current, currentProps, emit);
      state = { kind: 'idle' };
    },
    cancel: () => {
      state = { kind: 'idle' };
    },
    keyDown: (key, pointer = { x: 0, y: 0 }) => {
      if (!canEdit(currentProps)) return false;
      const focusedId = currentProps.selectedIds?.at(-1);
      const focused = currentProps.items.find((item) => item.id === focusedId);
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
    update: (nextProps) => {
      currentProps = nextProps;
    },
  };
}

/*** Determines whether the component-wide interaction policy permits edit intents. */
function canEdit(props: GridInteractionsControllerProps): boolean {
  return props.interactionPolicy !== 'passive';
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
      viewport: panViewport(state.viewport, {
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
    emit({ type: 'move', itemIds: state.itemIds, rects: moveWorldRects(state.items, delta) });
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
  const anchor = state.kind === 'resize' ? state.item : state.items.at(0);
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

/*** Keep pointer coordinates in the original gesture coordinate space across controlled updates. */
function viewportForState(state: InteractionState, fallback: GridViewport): GridViewport {
  return state.kind === 'idle' ? fallback : state.viewport;
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
