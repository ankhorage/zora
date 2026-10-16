/** Largest native-versus-requested scroll offset difference, in pixels, still treated as the same position. */
export const SCROLL_POSITION_TOLERANCE = 1;

/** Upper bound for a native animated `scrollTo` to deliver its settled offset. */
export const ANIMATED_SCROLL_WINDOW_MS = 700;

/** Upper bound for an immediate `scrollTo` to deliver its settled offset. */
export const IMMEDIATE_SCROLL_WINDOW_MS = 120;

/** Quiet period after the last in-flight frame before the viewport adopts the native offset. */
export const SCROLL_SETTLE_DELAY_MS = 120;
