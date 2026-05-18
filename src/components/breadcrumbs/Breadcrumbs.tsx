import React from 'react';

import { Inline } from '../../foundation';
import { resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Button } from '../button';
import { Icon } from '../icon';
import { Text } from '../text';
import type { BreadcrumbItem, BreadcrumbsProps } from './types';

interface BreadcrumbRenderItem {
  item?: BreadcrumbItem;
  type: 'item' | 'ellipsis';
}

function normalizeMaxItems(value: number | undefined): number | undefined {
  if (value === undefined || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.max(0, Math.trunc(value));
}

function createRenderItems(
  items: readonly BreadcrumbItem[],
  maxItems: number | undefined,
): readonly BreadcrumbRenderItem[] {
  if (maxItems === undefined || maxItems === 0 || items.length <= maxItems || maxItems < 3) {
    return items.map((item) => ({ item, type: 'item' }));
  }

  const trailingCount = maxItems - 2;
  const trailingItems = items.slice(items.length - trailingCount);

  return [
    { item: items[0], type: 'item' },
    { type: 'ellipsis' },
    ...trailingItems.map((item) => ({ item, type: 'item' }) satisfies BreadcrumbRenderItem),
  ];
}

function renderSeparator(separator: React.ReactNode) {
  return (
    <Text emphasis="muted" variant="bodySmall">
      {separator}
    </Text>
  );
}

function BreadcrumbLabel({ item, compact }: { item: BreadcrumbItem; compact: boolean }) {
  const { theme } = useZoraTheme();

  return (
    <Inline align="center" gap="xs" wrap="nowrap">
      {item.icon ? (
        <Icon
          color={theme.semantics.content.muted}
          name={item.icon.name}
          provider={item.icon.provider}
          size={resolveIconSize(compact ? 's' : 'm')}
        />
      ) : null}
      <Text emphasis="muted" variant={compact ? 'caption' : 'bodySmall'}>
        {item.label}
      </Text>
    </Inline>
  );
}

function BreadcrumbsInner({
  themeId: _themeId,
  mode: _mode,
  items,
  separator = '/',
  maxItems,
  compact = false,
  disabled = false,
  testID,
}: BreadcrumbsProps) {
  const normalizedMaxItems = normalizeMaxItems(maxItems);
  const renderItems = createRenderItems(items, normalizedMaxItems);
  const currentItemId = items.at(-1)?.id;

  if (items.length === 0) {
    return null;
  }

  return (
    <Inline align="center" gap={compact ? 'xs' : 's'} testID={testID} wrap="wrap">
      {renderItems.map((renderItem, index) => {
        const isLastRenderedItem = index === renderItems.length - 1;
        const showSeparator = !isLastRenderedItem;

        if (renderItem.type === 'ellipsis') {
          return (
            <React.Fragment key="ellipsis">
              <Text emphasis="muted" variant={compact ? 'caption' : 'bodySmall'}>
                …
              </Text>
              {showSeparator ? renderSeparator(separator) : null}
            </React.Fragment>
          );
        }

        const item = renderItem.item;
        if (!item) {
          return null;
        }

        const current = item.id === currentItemId;
        const interactive = !current && !disabled && !item.disabled && Boolean(item.onPress);

        return (
          <React.Fragment key={item.id}>
            {interactive ? (
              <Button
                color="neutral"
                disabled={disabled || item.disabled}
                leadingIcon={item.icon}
                onPress={item.onPress}
                size={compact ? 's' : 'm'}
                testID={testID ? `${testID}-item-${item.id}` : undefined}
                variant="ghost"
              >
                {item.label}
              </Button>
            ) : (
              <BreadcrumbLabel item={item} compact={compact} />
            )}
            {showSeparator ? renderSeparator(separator) : null}
          </React.Fragment>
        );
      })}
    </Inline>
  );
}

export const Breadcrumbs = withZoraThemeScope(BreadcrumbsInner);
