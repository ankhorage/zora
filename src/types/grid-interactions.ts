import type {
  GridInteractionRectItem,
  GridMarqueeSelectionMode,
  GridRect,
  GridResizeHandle,
  GridSnapCandidate,
  GridViewport,
} from '@ankhorage/grid-view';
import type React from 'react';

import type { ZoraBaseProps } from './base';

/** A caller-owned world item accepted by the platform interaction adapter. */
export interface GridInteractionItem extends GridInteractionRectItem {
  readonly readOnly?: boolean;
  readonly passive?: boolean;
}

/** Caller-controlled snapping inputs for both world axes. */
export interface GridInteractionSnap {
  readonly enabled?: boolean;
  readonly tolerancePixels: number;
  readonly priorities: readonly GridSnapCandidate['kind'][];
  readonly x?: readonly GridSnapCandidate[];
  readonly y?: readonly GridSnapCandidate[];
}

/** Events emitted by the adapter; callers remain responsible for mutations. */
export interface GridInteractionIntent {
  readonly type: 'select' | 'move' | 'resize' | 'marquee' | 'pan';
  readonly itemIds: readonly string[];
  readonly rects?: readonly GridInteractionItem[];
  readonly marquee?: GridRect;
  readonly viewport?: GridViewport;
}

/** Public, controlled inputs for generic world-space grid interaction. */
export interface GridInteractionsProps extends ZoraBaseProps {
  readonly children: React.ReactNode;
  readonly viewport: GridViewport;
  readonly items: readonly GridInteractionItem[];
  readonly selectedIds?: readonly string[];
  readonly marqueeMode?: GridMarqueeSelectionMode;
  readonly snap?: GridInteractionSnap;
  readonly onIntent: (intent: GridInteractionIntent) => void;
}

/** The non-visual controlled contract consumed by the platform-neutral controller. */
export type GridInteractionsControllerProps = Omit<GridInteractionsProps, 'children'>;

/** Pointer coordinates in viewport pixels, independent of native or web event shapes. */
export interface GridInteractionPointer {
  readonly x: number;
  readonly y: number;
  readonly shiftKey?: boolean;
  readonly metaKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly altKey?: boolean;
  readonly spaceKey?: boolean;
}

/** Imperative handlers supplied to native responders or web pointer adapters. */
export interface GridInteractionsController {
  readonly begin: (pointer: GridInteractionPointer, handle?: GridResizeHandle) => void;
  readonly move: (pointer: GridInteractionPointer) => void;
  readonly end: (pointer: GridInteractionPointer) => void;
  readonly cancel: () => void;
  readonly keyDown: (key: string, pointer?: GridInteractionPointer) => boolean;
}
