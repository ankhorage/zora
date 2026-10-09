export interface ExplorerPageRequestSignature {
  readonly collectionId: string | undefined;
  readonly loadedItemCount: number;
  readonly retryToken: string | undefined;
}

/*** Preserves one request per provider page boundary until its collection, row count, or retry token changes. */
export function shouldDispatchExplorerPageRequest(
  previous: ExplorerPageRequestSignature | null,
  next: ExplorerPageRequestSignature,
): boolean {
  if (previous === null) return true;
  return (
    previous.collectionId !== next.collectionId ||
    previous.loadedItemCount !== next.loadedItemCount ||
    previous.retryToken !== next.retryToken
  );
}
