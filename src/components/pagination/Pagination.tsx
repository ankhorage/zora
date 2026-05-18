import React from 'react';

import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Button } from '../button';
import { Text } from '../text';
import type { PaginationProps } from './types';

type PaginationItem = number | 'ellipsis';

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(Math.trunc(value), min), max);
}

function createRange(start: number, end: number): number[] {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function normalizeCount(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.trunc(value));
}

function createPaginationItems({
  page,
  pageCount,
  siblingCount,
  boundaryCount,
  compact,
}: {
  page: number;
  pageCount: number;
  siblingCount: number;
  boundaryCount: number;
  compact: boolean;
}): readonly PaginationItem[] {
  if (pageCount <= 0) {
    return [];
  }

  if (compact) {
    return [page];
  }

  const boundaries = createRange(1, Math.min(boundaryCount, pageCount));
  const trailingBoundaries = createRange(Math.max(pageCount - boundaryCount + 1, 1), pageCount);
  const siblings = createRange(
    Math.max(page - siblingCount, 1),
    Math.min(page + siblingCount, pageCount),
  );
  const pages = [...new Set([...boundaries, ...siblings, ...trailingBoundaries])].sort(
    (left, right) => left - right,
  );
  const items: PaginationItem[] = [];

  pages.forEach((nextPage, index) => {
    const previousPage = pages[index - 1];
    if (previousPage !== undefined && nextPage - previousPage > 1) {
      items.push('ellipsis');
    }

    items.push(nextPage);
  });

  return items;
}

function PaginationInner({
  themeId: _themeId,
  mode: _mode,
  page,
  pageCount,
  onPageChange,
  disabled = false,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = false,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  firstLabel = 'First',
  lastLabel = 'Last',
  compact = false,
  testID,
}: PaginationProps) {
  const normalizedPageCount = Math.max(0, Math.trunc(Number.isFinite(pageCount) ? pageCount : 0));
  const currentPage = clampInteger(page, 1, Math.max(normalizedPageCount, 1));
  const safeSiblingCount = normalizeCount(siblingCount, 1);
  const safeBoundaryCount = normalizeCount(boundaryCount, 1);
  const items = createPaginationItems({
    boundaryCount: safeBoundaryCount,
    compact,
    page: currentPage,
    pageCount: normalizedPageCount,
    siblingCount: safeSiblingCount,
  });
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < normalizedPageCount;
  const navigationDisabled = disabled || normalizedPageCount <= 1;

  const changePage = (nextPage: number) => {
    const clampedPage = clampInteger(nextPage, 1, Math.max(normalizedPageCount, 1));
    if (disabled || clampedPage === currentPage) {
      return;
    }

    onPageChange?.(clampedPage);
  };

  return (
    <Stack align="center" direction="row" gap="xs" testID={testID}>
      {showFirstLast ? (
        <Button
          disabled={navigationDisabled || currentPage === 1}
          onPress={() => changePage(1)}
          size="s"
          testID={testID ? `${testID}-first` : undefined}
          variant="ghost"
        >
          {firstLabel}
        </Button>
      ) : null}

      <Button
        disabled={navigationDisabled || !canGoPrevious}
        onPress={() => changePage(currentPage - 1)}
        size="s"
        testID={testID ? `${testID}-previous` : undefined}
        variant="ghost"
      >
        {previousLabel}
      </Button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <Text key={`ellipsis-${index}`} emphasis="muted" variant="bodySmall">
            …
          </Text>
        ) : (
          <Button
            color={item === currentPage ? 'primary' : 'neutral'}
            disabled={disabled}
            key={item}
            onPress={() => changePage(item)}
            size="s"
            testID={testID ? `${testID}-page-${item}` : undefined}
            variant={item === currentPage ? 'solid' : 'ghost'}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        disabled={navigationDisabled || !canGoNext}
        onPress={() => changePage(currentPage + 1)}
        size="s"
        testID={testID ? `${testID}-next` : undefined}
        variant="ghost"
      >
        {nextLabel}
      </Button>

      {showFirstLast ? (
        <Button
          disabled={navigationDisabled || currentPage === normalizedPageCount}
          onPress={() => changePage(normalizedPageCount)}
          size="s"
          testID={testID ? `${testID}-last` : undefined}
          variant="ghost"
        >
          {lastLabel}
        </Button>
      ) : null}
    </Stack>
  );
}

export const Pagination = withZoraThemeScope(PaginationInner);
