import React from 'react';

import type { PaginationProps } from '../../../../types/pagination';
import { Button } from '../../../button/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Text } from '../../../typography/public';
import { resolvePaginationPage } from '../../utils/resolvePaginationPage';
import { resolvePaginationState } from '../../utils/resolvePaginationState';

/*** Renders controls for navigating between pages of a finite result set. */
export const Pagination = withZoraThemeScope(PaginationInner);

/*** Connects normalized pagination state to visible page navigation controls. */
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
  interactionPolicy,
}: PaginationProps) {
  const passive = interactionPolicy === 'passive';
  const state = resolvePaginationState({ boundaryCount, compact, page, pageCount, siblingCount });
  const canGoPrevious = state.currentPage > 1;
  const canGoNext = state.currentPage < state.pageCount;
  const navigationDisabled = disabled || state.pageCount <= 1;

  const changePage = React.useCallback(
    (nextPage: number) => {
      const clampedPage = resolvePaginationPage(nextPage, state.pageCount);
      if (passive || disabled || clampedPage === state.currentPage) return;
      onPageChange?.(clampedPage);
    },
    [disabled, onPageChange, passive, state.currentPage, state.pageCount],
  );

  return (
    <View align="center" direction="row" gap="xs" testID={testID}>
      {showFirstLast ? (
        <Button
          disabled={navigationDisabled || state.currentPage === 1}
          interactionPolicy={interactionPolicy}
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
        interactionPolicy={interactionPolicy}
        onPress={() => changePage(state.currentPage - 1)}
        size="s"
        testID={testID ? `${testID}-previous` : undefined}
        variant="ghost"
      >
        {previousLabel}
      </Button>
      {state.items.map((item, index) =>
        item === 'ellipsis' ? (
          <Text key={`ellipsis-${index}`} emphasis="muted" variant="bodySmall">
            …
          </Text>
        ) : (
          <Button
            color={item === state.currentPage ? 'primary' : 'neutral'}
            disabled={disabled}
            interactionPolicy={interactionPolicy}
            key={item}
            onPress={() => changePage(item)}
            size="s"
            testID={testID ? `${testID}-page-${item}` : undefined}
            variant={item === state.currentPage ? 'solid' : 'ghost'}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        disabled={navigationDisabled || !canGoNext}
        interactionPolicy={interactionPolicy}
        onPress={() => changePage(state.currentPage + 1)}
        size="s"
        testID={testID ? `${testID}-next` : undefined}
        variant="ghost"
      >
        {nextLabel}
      </Button>
      {showFirstLast ? (
        <Button
          disabled={navigationDisabled || state.currentPage === state.pageCount}
          interactionPolicy={interactionPolicy}
          onPress={() => changePage(state.pageCount)}
          size="s"
          testID={testID ? `${testID}-last` : undefined}
          variant="ghost"
        >
          {lastLabel}
        </Button>
      ) : null}
    </View>
  );
}
