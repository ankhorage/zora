import type { ColorHarmony, HexColor } from '@ankhorage/color-theory';

import type { ZoraBaseProps } from './base';

export type ColorPickerTab = 'wheel' | 'tone' | 'hue';

/** A consumer-owned OKLCH target from the published Templates tone catalog. */
export interface ColorToneTarget {
  readonly lightness: number;
  readonly chroma: number;
}

/**
 * Structural boundary for a Templates tone-pair entry. ZORA intentionally owns
 * neither the catalog nor its classifications.
 */
export interface ColorToneDefinition {
  readonly id: string;
  readonly accent: string;
  readonly accentTarget: ColorToneTarget;
}

export interface ColorWheelSelection {
  readonly color: HexColor;
  readonly harmony: ColorHarmony | null;
}

export interface ColorToneSelection {
  readonly toneId: string;
  readonly colors: readonly HexColor[];
}

/** The persistent, controlled state for every independently selectable picker mode. */
export interface ColorPickerValue {
  readonly tab: ColorPickerTab;
  readonly wheel: ColorWheelSelection;
  readonly tone: ColorToneSelection | null;
  readonly hue: HexColor;
}

/** A single mode-specific update emitted by the composed picker. */
export type ColorPickerSelection =
  | { readonly mode: 'wheel'; readonly value: ColorWheelSelection }
  | { readonly mode: 'tone'; readonly value: ColorToneSelection }
  | { readonly mode: 'hue'; readonly value: HexColor };

export interface ColorWheelProps extends ZoraBaseProps {
  readonly value: HexColor;
  readonly harmony?: ColorHarmony | null;
  readonly harmonies?: readonly ColorHarmony[];
  readonly onChange: (selection: ColorWheelSelection) => void;
}

export interface ColorToneProps extends ZoraBaseProps {
  readonly tones: readonly ColorToneDefinition[];
  readonly selectionMode?: 'single' | 'multiple';
  readonly value: ColorToneSelection | null;
  readonly onChange: (selection: ColorToneSelection) => void;
}

export interface ColorHueScaleProps extends ZoraBaseProps {
  readonly value: HexColor;
  readonly onChange: (color: HexColor) => void;
}

export interface ColorPickerProps extends ZoraBaseProps {
  readonly tabs: readonly ColorPickerTab[];
  readonly value: ColorPickerValue;
  readonly onValueChange: (value: ColorPickerValue) => void;
  readonly onSelectionChange?: (selection: ColorPickerSelection) => void;
  readonly hideTabListWhenSingle?: boolean;
  readonly wheel?: Omit<ColorWheelProps, 'onChange' | 'value'>;
  readonly tone?: Omit<ColorToneProps, 'onChange' | 'value'>;
  readonly hue?: Omit<ColorHueScaleProps, 'onChange' | 'value'>;
}
