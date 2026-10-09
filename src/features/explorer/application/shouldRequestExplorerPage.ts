/*** Determines whether the mounted viewport has reached the provider-owned page boundary. */
export function shouldRequestExplorerPage(
  itemIds: readonly string[],
  visibleIds: readonly string[],
  hasMore: boolean,
  loadingMore: boolean,
  threshold = 12,
): boolean {
  if (!hasMore || loadingMore || visibleIds.length === 0) return false;
  const firstPagingIndex = Math.max(0, itemIds.length - threshold);
  return visibleIds.some((id) => itemIds.indexOf(id) >= firstPagingIndex);
}
