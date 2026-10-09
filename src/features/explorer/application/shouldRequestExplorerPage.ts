import type { ExplorerPermissionStatus } from '../../../types/explorer';

/*** Determines whether the mounted, accessible viewport has reached the provider-owned page boundary. */
export function shouldRequestExplorerPage(
  itemIds: readonly string[],
  visibleIds: readonly string[],
  hasMore: boolean,
  loadingMore: boolean,
  loading: boolean,
  errorText: string | undefined,
  permissionStatus: ExplorerPermissionStatus,
  threshold = 12,
): boolean {
  if (
    !hasMore ||
    loadingMore ||
    loading ||
    errorText !== undefined ||
    (permissionStatus !== 'granted' && permissionStatus !== 'limited') ||
    visibleIds.length === 0
  ) {
    return false;
  }
  const firstPagingIndex = Math.max(0, itemIds.length - threshold);
  return visibleIds.some((id) => itemIds.indexOf(id) >= firstPagingIndex);
}
