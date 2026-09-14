/*** Clamps a requested pagination page to the valid one-based page range. */
export function resolvePaginationPage(value: number, pageCount: number): number {
  if (!Number.isFinite(value)) return 1;

  return Math.min(Math.max(Math.trunc(value), 1), Math.max(pageCount, 1));
}
