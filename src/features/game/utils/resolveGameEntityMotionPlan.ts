import type { GameEntityEasing, GameEntityMotionProps } from '../../../types/gamePresentation';

export interface GameEntityMotionPlan {
  readonly transitionDurationMs: number;
  readonly transitionEasing: GameEntityEasing;
  readonly motionDurationMs: number;
  readonly motionDelayMs: number;
  readonly motionEasing: GameEntityEasing;
  readonly motionEnabled: boolean;
  readonly motionRepeat: boolean;
  readonly motionAlternate: boolean;
  readonly motionPaused: boolean;
}

/*** Normalize serializable GameEntity motion props against the current reduced-motion preference. */
export function resolveGameEntityMotionPlan(
  props: GameEntityMotionProps,
  reduceMotion: boolean,
): GameEntityMotionPlan {
  const essential = props.motionEssential === true;
  const motionEnabled =
    hasMotionOffset(props) &&
    normalizeDuration(props.motionDurationMs) > 0 &&
    (!reduceMotion || essential);

  return {
    transitionDurationMs: reduceMotion ? 0 : normalizeDuration(props.transitionDurationMs),
    transitionEasing: props.transitionEasing ?? 'linear',
    motionDurationMs: normalizeDuration(props.motionDurationMs),
    motionDelayMs: normalizeDuration(props.motionDelayMs),
    motionEasing: props.motionEasing ?? 'linear',
    motionEnabled,
    motionRepeat: props.motionRepeat === true,
    motionAlternate: props.motionRepeat === true && props.motionAlternate === true,
    motionPaused: props.motionPaused === true,
  };
}

/*** Return whether any relative presentation offset requires a motion timeline. */
function hasMotionOffset(props: GameEntityMotionProps): boolean {
  return (
    (props.motionOffsetX ?? 0) !== 0 ||
    (props.motionOffsetY ?? 0) !== 0 ||
    (props.motionOpacityDelta ?? 0) !== 0 ||
    (props.motionScaleDelta ?? 0) !== 0 ||
    (props.motionRotationDelta ?? 0) !== 0
  );
}

/*** Clamp an optional duration to a finite non-negative millisecond value. */
function normalizeDuration(value: number | undefined): number {
  return value === undefined || !Number.isFinite(value) ? 0 : Math.max(0, value);
}
