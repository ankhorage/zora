import { resolvePaginationPage } from './resolvePaginationPage';

/*** Normalizes pagination input and resolves visible page and ellipsis items. */
export function resolvePaginationState({
  page,
  pageCount,
  siblingCount,
  boundaryCount,
  compact,
}: PaginationStateInput): PaginationState {
  const normalizedPageCount = Math.max(0, Math.trunc(Number.isFinite(pageCount) ? pageCount : 0));
  const currentPage = resolvePaginationPage(page, normalizedPageCount);
  const safeSiblingCount = normalizeCount(siblingCount, 1);
  const safeBoundaryCount = normalizeCount(boundaryCount, 1);

  if (normalizedPageCount <= 0) {
    return { currentPage, items: [], pageCount: normalizedPageCount };
  }

  if (compact) {
    return { currentPage, items: [currentPage], pageCount: normalizedPageCount };
  }

  const boundaries = createRange(1, Math.min(safeBoundaryCount, normalizedPageCount));
  const trailingBoundaries = createRange(
    Math.max(normalizedPageCount - safeBoundaryCount + 1, 1),
    normalizedPageCount,
  );
  const siblings = createRange(
    Math.max(currentPage - safeSiblingCount, 1),
    Math.min(currentPage + safeSiblingCount, normalizedPageCount),
  );
  const pages = [...new Set([...boundaries, ...siblings, ...trailingBoundaries])].sort(
    (left, right) => left - right,
  );
  const items = pages.flatMap<PaginationItem>((nextPage, index) => {
    const previousPage = index > 0 ? pages.at(index - 1) : undefined;
    return previousPage !== undefined && nextPage - previousPage > 1
      ? ['ellipsis', nextPage]
      : [nextPage];
  });

  return { currentPage, items, pageCount: normalizedPageCount };
}

type PaginationItem = number | 'ellipsis';

interface PaginationStateInput {
  page: number;
  pageCount: number;
  siblingCount: number | undefined;
  boundaryCount: number | undefined;
  compact: boolean;
}

interface PaginationState {
  currentPage: number;
  pageCount: number;
  items: readonly PaginationItem[];
}

/*** Creates an inclusive numeric range for pagination boundaries and siblings. */
function createRange(start: number, end: number): number[] {
  return end < start ? [] : Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/*** Normalizes optional pagination counts to finite non-negative integers. */
function normalizeCount(value: number | undefined, fallback: number): number {
  return value === undefined || !Number.isFinite(value) ? fallback : Math.max(0, Math.trunc(value));
}
