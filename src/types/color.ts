import type { ColorHarmony, HexColor } from '@ankhorage/color-theory';

import type { ZoraBaseProps } from './base';

export const COLOR_PICKER_TABS = ['wheel', 'tone', 'hue'] as const;

export type ColorPickerTab = (typeof COLOR_PICKER_TABS)[number];

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

export interface ColorWheelProps extends ZoraBaseProps {
  readonly value: HexColor;
  readonly harmony?: ColorHarmony | null;
  readonly harmonies?: readonly ColorHarmony[];
  readonly onChange: (selection: ColorWheelSelection) => void;
}

export interface ColorToneProps extends ZoraBaseProps {
  readonly tones: readonly ColorToneDefinition[];
  readonly hue: number;
  readonly selectionMode?: 'single' | 'multiple';
  readonly value: readonly string[];
  readonly onChange: (selection: ColorToneSelection) => void;
}

export interface ColorHueScaleProps extends ZoraBaseProps {
  readonly value: HexColor;
  readonly onChange: (color: HexColor) => void;
}

export interface ColorPickerProps extends ZoraBaseProps {
  readonly tabs: readonly ColorPickerTab[];
  readonly value?: ColorPickerTab;
  readonly defaultValue?: ColorPickerTab;
  readonly onValueChange?: (tab: ColorPickerTab) => void;
  readonly hideTabListWhenSingle?: boolean;
  readonly wheel?: ColorWheelProps;
  readonly tone?: ColorToneProps;
  readonly hue?: ColorHueScaleProps;
}
