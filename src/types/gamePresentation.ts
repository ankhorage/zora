import type { GameDefinition, GameInput, GameOutput } from '@ankhorage/game';
import type React from 'react';

import type { ZoraBaseProps } from './base';

type GameOverlayCornerPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type GamePointerEvents = 'auto' | 'box-none' | 'box-only' | 'none';
export type GameEntityEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface GameEntityMotionProps {
  readonly transitionDurationMs?: number;
  readonly transitionEasing?: GameEntityEasing;
  readonly motionOffsetX?: number;
  readonly motionOffsetY?: number;
  readonly motionOpacityDelta?: number;
  readonly motionScaleDelta?: number;
  readonly motionRotationDelta?: number;
  readonly motionDurationMs?: number;
  readonly motionDelayMs?: number;
  readonly motionEasing?: GameEntityEasing;
  readonly motionRepeat?: boolean;
  readonly motionAlternate?: boolean;
  readonly motionPaused?: boolean;
  readonly motionEssential?: boolean;
}
export type GameOverlayPlacement =
  'fill' | 'center' | 'top' | 'bottom' | GameOverlayCornerPlacement;

export interface GameFieldProps extends ZoraBaseProps {
  readonly children?: React.ReactNode;
  readonly aspectRatio?: number;
  readonly minHeight?: number;
  readonly fill?: boolean;
  readonly clip?: boolean;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
}

export interface GameEntityProps extends GameEntityMotionProps, ZoraBaseProps {
  readonly children?: React.ReactNode;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly opacity?: number;
  readonly scale?: number;
  readonly rotation?: number;
  readonly zIndex?: number;
  readonly hidden?: boolean;
  readonly pointerEvents?: GamePointerEvents;
  readonly measurementId?: string;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
}

export interface GameKeyboardBinding {
  readonly key: string;
  readonly eventType?: string;
  readonly entityId?: string;
  readonly preventDefault?: boolean;
}

export interface GameInputZoneProps extends ZoraBaseProps {
  readonly eventType: string;
  readonly entityId?: string;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly zIndex?: number;
  readonly enabled?: boolean;
  readonly continuous?: boolean;
  readonly keyboardBindings?: readonly GameKeyboardBinding[];
  readonly accessibilityLabel?: string;
  readonly testID?: string;
}

export interface GameMeasurementProbeProps extends ZoraBaseProps {
  readonly sourceId: string;
  readonly targetId: string;
  readonly eventType?: string;
  readonly entityId?: string;
  readonly delayMs?: number;
  readonly enabled?: boolean;
}

export interface GameOverlayProps extends ZoraBaseProps {
  readonly children?: React.ReactNode;
  readonly placement?: GameOverlayPlacement;
  readonly blocking?: boolean;
  readonly padding?: number;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
}

export interface GameProps extends GameFieldProps {
  readonly definition: GameDefinition;
  readonly input?: GameInput;
  readonly seed?: number;
  readonly resetKey?: string;
  readonly autoAdvanceTime?: boolean;
  readonly onOutput?: (output: GameOutput) => void;
}
