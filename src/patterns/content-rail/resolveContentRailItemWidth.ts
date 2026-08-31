import type { ContentRailItemSize } from './types';

export function resolveContentRailItemWidth({
  gap,
  itemCount,
  itemSize,
  padding,
  peek,
  viewportWidth,
}: {
  gap: number;
  itemCount: number;
  itemSize: ContentRailItemSize;
  padding: number;
  peek: number;
  viewportWidth: number;
}): number {
  const availableWidth = Math.max(0, viewportWidth - padding * 2);
  if (availableWidth === 0 || itemCount === 0) return 0;

  const fixedWidth = resolveFixedItemWidth(itemSize);
  if (fixedWidth !== undefined) return Math.min(fixedWidth, availableWidth);

  const slots = viewportWidth >= 1024 ? 4 : viewportWidth >= 768 ? 3 : viewportWidth >= 480 ? 2 : 1;
  const fullItems = Math.min(slots, itemCount);
  const overflows = itemCount > fullItems;
  const resolvedPeek = overflows ? Math.min(Math.max(0, peek), availableWidth / 2) : 0;
  const gaps = overflows ? fullItems : Math.max(0, fullItems - 1);
  const resolved = (availableWidth - resolvedPeek - gap * gaps) / fullItems;

  return Math.min(280, Math.max(Math.min(96, availableWidth), Math.floor(resolved)));
}

function resolveFixedItemWidth(itemSize: ContentRailItemSize): number | undefined {
  if (itemSize === 'compact') return 144;
  if (itemSize === 'regular') return 200;
  if (itemSize === 'wide') return 280;
  return undefined;
}
