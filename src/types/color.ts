import type { ColorHarmony, HexColor } from '@ankhorage/color-theory';

import type { ZoraBaseProps } from './base';

export type ColorPickerTab = 'grid' | 'wheel';

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
  /** Enabled presentations, in Grid then Wheel order by default. */
  readonly tabs?: readonly ColorPickerTab[];
  /** The one authoritative selected colour. */
  readonly primaryColor: HexColor;
  /** Optional owner-provided harmony applied to both presentations. */
  readonly harmony?: ColorHarmony;
  /** Optional consumer-owned tone-family id. */
  readonly tone?: string;
  /** Consumer-owned tone catalogue; ZORA deliberately does not copy it. */
  readonly tones?: readonly ColorToneDefinition[];
  /** Requested outer logical width; hosts must provide at least 360 logical pixels. */
  readonly width?: number;
  /** Controlled active presentation. */
  readonly activeTab?: ColorPickerTab;
  /** Emits one canonical controlled selection payload. */
  readonly onValueChange: (value: {
    readonly primaryColor: HexColor;
    readonly harmony?: ColorHarmony;
    readonly tone?: string;
  }) => void;
  /** Notifies a consumer that a controlled active presentation must change. */
  readonly onActiveTabChange?: (tab: ColorPickerTab) => void;
  /** Requests dismissal from the owning Popover or BottomSheet presentation. */
  readonly onDismiss?: () => void;
  readonly hideTabListWhenSingle?: boolean;
  readonly wheel?: Omit<ColorWheelProps, 'onChange' | 'value' | 'harmony'>;
}
