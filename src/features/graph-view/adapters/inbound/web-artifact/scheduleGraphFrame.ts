/*** Schedule one graph-runtime callback after browser paint with a non-browser fallback. */
export function scheduleGraphFrame(callback: () => void) {
  const frame = (
    globalThis as unknown as {
      requestAnimationFrame?: (scheduled: () => void) => number;
    }
  ).requestAnimationFrame;
  if (frame) {
    frame(callback);
    return;
  }
  setTimeout(callback, 0);
}
