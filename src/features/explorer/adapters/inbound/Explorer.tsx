import React from 'react';
import { Pressable as NativePressable, View as NativeView } from 'react-native';

import type { ExplorerItem, ExplorerProps } from '../../../../types/explorer';
import { TileGrid } from '../../../grid-view/public';
import { Icon } from '../../../icon/public';
import { Image } from '../../../image/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';
import { getExplorerNextFocusId } from '../../application/getExplorerNextFocusId';
import { resolveExplorerSelection } from '../../application/resolveExplorerSelection';
import { ExplorerKeyboardProxy } from './ExplorerKeyboardProxy';

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
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const tileRefs = React.useRef(new Map<string, { focus?: () => void }>());
  const effectiveSelectedIds = selectedIds ?? internalSelectedIds;
  const itemLookup = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const ids = items.filter((item) => !item.disabled).map((item) => item.id);
  const selected = new Set(effectiveSelectedIds);
  const passive = interactionPolicy === 'passive' || disabled || readOnly;
  const columns = Math.max(1, Math.floor(((width ?? tileSize) + 12) / (tileSize + 12)));

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

  const renderTile = (tile: { readonly id: string }) => {
    const item = itemLookup.get(tile.id);
    if (!item) return null;
    const isSelected = selected.has(item.id);
    const canInteract = !passive && !item.disabled;
    return (
      <ExplorerKeyboardProxy
        onKeyDown={(key, shiftKey) => {
          const nextId = getExplorerNextFocusId(ids, item.id, key, columns);
          if (!nextId || nextId === item.id) return;
          setFocusedId(nextId);
          setTimeout(() => tileRefs.current.get(nextId)?.focus?.(), 0);
          if (shiftKey) {
            const nextItem = itemLookup.get(nextId);
            if (nextItem) select(nextItem, 'range');
          }
        }}
      >
        <NativePressable
          accessibilityLabel={item.name}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected, disabled: !canInteract }}
          disabled={!canInteract}
          onFocus={() => setFocusedId(item.id)}
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
          ref={(node) => {
            if (node) tileRefs.current.set(item.id, node);
            else tileRefs.current.delete(item.id);
          }}
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

  if (errorText) return <Text testID={testID}>{errorText}</Text>;
  if (loading) return <Text testID={testID}>Loading…</Text>;
  if (items.length === 0) return <Text testID={testID}>{emptyText}</Text>;

  return (
    <TileGrid
      height={height}
      focusedItemId={focusedId ?? undefined}
      interactionPolicy={interactionPolicy}
      items={items}
      renderItem={renderTile}
      testID={testID}
      tileSize={tileSize}
      width={width}
      zoom={zoom}
    />
  );
}

/*** Normalize platform press modifiers for multi-selection without passing event objects into contracts. */
function resolveExplorerPressIntent(event: unknown): 'replace' | 'toggle' | 'range' {
  if (typeof event !== 'object' || event === null) return 'replace';
  if ('shiftKey' in event && event.shiftKey === true) return 'range';
  if ('ctrlKey' in event && event.ctrlKey === true) return 'toggle';
  if ('metaKey' in event && event.metaKey === true) return 'toggle';
  return 'replace';
}
