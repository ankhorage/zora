import React from 'react';
import { Platform, Pressable as NativePressable, View as NativeView } from 'react-native';

import type { ExplorerItem, ExplorerProps } from '../../../../types/explorer';
import { TileGrid } from '../../../grid-view/public';
import { Icon } from '../../../icon/public';
import { Image } from '../../../image/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';
import { resolveExplorerSelection } from '../../application/resolveExplorerSelection';
import {
  type ExplorerPageRequestSignature,
  shouldDispatchExplorerPageRequest,
} from '../../application/shouldDispatchExplorerPageRequest';
import { shouldRequestExplorerPage } from '../../application/shouldRequestExplorerPage';
import { ExplorerKeyboardProxy } from './ExplorerKeyboardProxy';
import { useExplorerKeyboardFocus } from './useExplorerKeyboardFocus';

/*** Single canonical Explorer implementation for media and file catalogue presentation. */
export const Explorer = withZoraThemeScope(ExplorerInner);

/*** Presents provider-neutral asset tiles with controlled or uncontrolled selection. */
function ExplorerInner({
  items,
  selectedIds,
  defaultSelectedIds = [],
  selectionMode = 'single',
  onSelectionChange,
  onActivate,
  width,
  height,
  tileSize = 120,
  zoom = 1,
  loading = false,
  hasMore = false,
  loadingMore = false,
  pagingCollectionId,
  pagingRetryToken,
  onLoadMore,
  permissionStatus = 'granted',
  permissionText,
  onRequestPermission,
  errorText,
  emptyText = 'No items',
  disabled = false,
  readOnly = false,
  interactionPolicy,
  testID,
}: ExplorerProps) {
  const { theme } = useZoraTheme();
  const [internalSelectedIds, setInternalSelectedIds] =
    React.useState<readonly string[]>(defaultSelectedIds);
  const anchorId = React.useRef<string | null>(null);
  const [columns, setColumns] = React.useState(1);
  const [visibleIds, setVisibleIds] = React.useState<readonly string[]>([]);
  const lastPageRequestRef = React.useRef<ExplorerPageRequestSignature | null>(null);
  const effectiveSelectedIds = selectedIds ?? internalSelectedIds;
  const itemLookup = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const ids = React.useMemo(
    () => items.filter((item) => !item.disabled).map((item) => item.id),
    [items],
  );
  const selected = new Set(effectiveSelectedIds);
  const passive = interactionPolicy === 'passive' || disabled || readOnly;

  React.useEffect(() => {
    const request = {
      collectionId: pagingCollectionId,
      loadedItemCount: items.length,
      retryToken: pagingRetryToken,
    };
    if (
      !onLoadMore ||
      !shouldDispatchExplorerPageRequest(lastPageRequestRef.current, request) ||
      !shouldRequestExplorerPage(
        ids,
        visibleIds,
        hasMore,
        loadingMore,
        loading,
        errorText,
        permissionStatus,
      )
    ) {
      return;
    }
    lastPageRequestRef.current = request;
    onLoadMore({ loadedItemCount: items.length });
  }, [
    errorText,
    hasMore,
    ids,
    items.length,
    loading,
    loadingMore,
    onLoadMore,
    pagingCollectionId,
    pagingRetryToken,
    permissionStatus,
    visibleIds,
  ]);

  const select = (item: ExplorerItem, intent: 'replace' | 'toggle' | 'range') => {
    if (passive || item.disabled) return;
    const next = resolveExplorerSelection(
      ids,
      effectiveSelectedIds,
      item.id,
      anchorId.current,
      intent,
      selectionMode,
    );
    if (intent !== 'range') anchorId.current = item.id;
    if (selectedIds === undefined) setInternalSelectedIds(next);
    onSelectionChange?.({ selectedIds: next });
  };

  const keyboard = useExplorerKeyboardFocus(
    items,
    columns,
    passive,
    visibleIds,
    (targetId, originId, shiftKey) => {
      if (!shiftKey) return;
      anchorId.current ??= originId;
      const nextItem = itemLookup.get(targetId);
      if (nextItem) select(nextItem, 'range');
    },
  );

  const renderTile = (tile: { readonly id: string }) => {
    const item = itemLookup.get(tile.id);
    if (!item) return null;
    const isSelected = selected.has(item.id);
    const canInteract = !passive && !item.disabled;
    return (
      <ExplorerKeyboardProxy
        onKeyDown={(key, shiftKey) => keyboard.onKeyDown(item.id, key, shiftKey)}
      >
        <NativePressable
          accessibilityLabel={item.name}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected, disabled: !canInteract }}
          disabled={!canInteract}
          focusable={canInteract && (Platform.OS !== 'web' || item.id === keyboard.tabStopId)}
          onFocus={() => keyboard.onFocus(item.id)}
          onLongPress={() => select(item, 'toggle')}
          onPress={(event) => {
            const intent = resolveExplorerPressIntent(event.nativeEvent);
            select(item, intent);
            if (selectionMode === 'single' && intent === 'replace') {
              onActivate?.({ id: item.id });
            }
          }}
          style={{
            flex: 1,
            overflow: 'hidden',
            borderRadius: 8,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? theme.colors.primary : theme.semantics.neutral.divider,
            backgroundColor: theme.semantics.neutral.surface,
            padding: 8,
            gap: 4,
          }}
          ref={(node) => keyboard.registerTile(item.id, node)}
          testID={`explorer-item-${item.id}`}
        >
          <NativeView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {item.thumbnailUri ? (
              <Image
                accessibilityLabel={item.name}
                aspectRatio={1}
                source={item.thumbnailUri}
                width="100%"
              />
            ) : (
              <Icon
                name={item.kind === 'folder' ? 'folder-outline' : 'document-outline'}
                size={32}
              />
            )}
          </NativeView>
          <Text numberOfLines={1} variant="caption">
            {item.name}
          </Text>
        </NativePressable>
      </ExplorerKeyboardProxy>
    );
  };

  if (permissionStatus === 'denied' || permissionStatus === 'unavailable') {
    return (
      <NativeView testID={testID}>
        <Text>{permissionText ?? 'This collection is unavailable without permission.'}</Text>
        {permissionStatus === 'denied' && onRequestPermission ? (
          <NativePressable accessibilityRole="button" onPress={onRequestPermission}>
            <Text>Grant access</Text>
          </NativePressable>
        ) : null}
      </NativeView>
    );
  }
  if (errorText) return <Text testID={testID}>{errorText}</Text>;
  if (loading) return <Text testID={testID}>Loading…</Text>;
  if (items.length === 0) return <Text testID={testID}>{emptyText}</Text>;

  return (
    <NativeView>
      {permissionStatus === 'limited' ? (
        <Text>{permissionText ?? 'Showing the media you have allowed.'}</Text>
      ) : null}
      <TileGrid
        focusedItemId={keyboard.focusedId ?? undefined}
        height={height}
        interactionPolicy={interactionPolicy}
        onColumnsChange={setColumns}
        onVisibleItemIdsChange={setVisibleIds}
        items={items}
        renderItem={renderTile}
        testID={testID}
        tileSize={tileSize}
        width={width}
        zoom={zoom}
      />
      {loadingMore ? <Text>Loading more…</Text> : null}
    </NativeView>
  );
}

/***
 * Normalize platform press modifiers into selection intents
 * without passing event objects into the public contracts.
 */
function resolveExplorerPressIntent(event: unknown): 'replace' | 'toggle' | 'range' {
  if (typeof event !== 'object' || event === null) return 'replace';
  if ('shiftKey' in event && event.shiftKey === true) return 'range';
  if ('ctrlKey' in event && event.ctrlKey === true) return 'toggle';
  if ('metaKey' in event && event.metaKey === true) return 'toggle';
  return 'replace';
}
