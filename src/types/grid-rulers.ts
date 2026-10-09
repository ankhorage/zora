import type {
  GridAxisCategory,
  GridAxisName,
  GridAxisTick,
  GridTickProvider,
  GridTickSpecification,
  GridViewport,
} from '@ankhorage/grid-view';

import type { ZoraBaseProps } from './base';

/** A tick source is display-only; it never configures interaction snapping. */
export type GridRulerTickSource =
  | {
      readonly kind: 'ticks';
      readonly specification: GridTickSpecification;
      readonly provider?: GridTickProvider;
    }
  | { readonly kind: 'categories'; readonly categories: readonly GridAxisCategory[] };

/** A projected mark is measured in viewport pixels from the supplied viewport's origin. */
export interface GridRulerMark {
  readonly position: number;
  readonly level: GridAxisTick['level'];
  readonly label?: string;
  readonly categoryId?: string;
}

/** A passive guide belongs to one world-space axis. */
export interface GridGuide {
  readonly id: string;
  readonly axis: GridAxisName;
  readonly position: number;
  readonly label?: string;
}

/** A single horizontal or vertical passive ruler strip. */
export interface GridRulerProps extends ZoraBaseProps {
  readonly axis: GridAxisName;
  readonly viewport: GridViewport;
  readonly tickSource: GridRulerTickSource;
  readonly thickness?: number;
  readonly offset?: number;
  readonly position?: 'start' | 'end';
  readonly direction?: 'ltr' | 'rtl';
  readonly accessibilityLabel?: string;
  readonly formatLabel?: (tick: GridAxisTick) => string | undefined;
}

/** A passive overlay of visible major/minor grid lines and explicit guides. */
export interface GridLineOverlayProps extends ZoraBaseProps {
  readonly viewport: GridViewport;
  readonly xTickSource?: GridRulerTickSource;
  readonly yTickSource?: GridRulerTickSource;
  readonly guides?: readonly GridGuide[];
  readonly accessibilityLabel?: string;
}
