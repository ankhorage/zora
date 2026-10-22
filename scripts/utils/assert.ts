/*** Throws a diagnostic error when a script invariant does not hold. */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
