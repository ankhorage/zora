export function resolveContentRailState({
  contentWidth,
  gap,
  itemCount,
  itemWidth,
  logicalOffset,
  viewportWidth,
}: {
  contentWidth: number;
  gap: number;
  itemCount: number;
  itemWidth: number;
  logicalOffset: number;
  viewportWidth: number;
}) {
  const maxOffset = Math.max(0, contentWidth - viewportWidth);
  const offset = Math.min(Math.max(0, logicalOffset), maxOffset);
  const stride = itemWidth + gap;
  const firstVisibleIndex = stride > 0 ? Math.min(itemCount - 1, Math.floor(offset / stride)) : 0;
  const lastVisibleIndex =
    stride > 0
      ? Math.min(itemCount - 1, Math.max(0, Math.ceil((offset + viewportWidth) / stride) - 1))
      : 0;
  const anchorIndex = stride > 0 ? Math.round(offset / stride) : 0;

  return {
    anchorIndex: Math.min(Math.max(0, anchorIndex), Math.max(0, itemCount - 1)),
    canGoNext: itemCount > 0 && offset < maxOffset - 1,
    canGoPrevious: itemCount > 0 && offset > 1,
    firstVisibleIndex: itemCount === 0 ? -1 : firstVisibleIndex,
    lastVisibleIndex: itemCount === 0 ? -1 : lastVisibleIndex,
    maxOffset,
    offset,
    stride,
  };
}
