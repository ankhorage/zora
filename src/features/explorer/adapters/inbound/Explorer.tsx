import React from 'react';
import { Pressable as NativePressable, View as NativeView } from 'react-native';

import type { ExplorerItem, ExplorerProps } from '../../../../types/explorer';
import { Icon } from '../../../icon/public';
import { Image } from '../../../image/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';
import { TileGrid } from '../../../grid-view/public';
import { resolveExplorerSelection } from '../../application/resolveExplorerSelection';

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
  const [internalSelectedIds, setInternalSelectedIds] = React.useState<readonly string[]>(defaultSelectedIds);
  const anchorId = React.useRef<string | null>(null);
  const effectiveSelectedIds = selectedIds ?? internalSelectedIds;
  const allowedItems = items.filter((item) => !item.disabled);
  const ids = allowedItems.map((item) => item.id);
  const selected = new Set(effectiveSelectedIds);
  const passive = interactionPolicy === 'passive' || disabled || readOnly;

  const select = (item: ExplorerItem, intent: 'replace' | 'toggle' | 'range') => {
    if (passive || item.disabled) return;
    const next = resolveExplorerSelection(ids, effectiveSelectedIds, item.id, anchorId.current, intent, selectionMode);
    if (intent !== 'range') anchorId.current = item.id;
    if (selectedIds === undefined) setInternalSelectedIds(next);
    onSelectionChange?.(next);
  };

  const renderTile = (tile: { readonly id: string }) => {
    const item = items.find((candidate) => candidate.id === tile.id);
    if (!item) return null;
    const isSelected = selected.has(item.id);
    const canInteract = !passive && !item.disabled;
    return (
      <NativePressable
        accessibilityLabel={item.name}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: !canInteract }}
        disabled={!canInteract}
        onLongPress={() => select(item, 'toggle')}
        onPress={(event) => {
          const nativeEvent = event.nativeEvent as unknown as Readonly<Record<string, unknown>>;
          const intent = nativeEvent.shiftKey === true ? 'range'
            : nativeEvent.ctrlKey === true || nativeEvent.metaKey === true ? 'toggle' : 'replace';
          select(item, intent);
          if (selectionMode === 'single' && intent === 'replace') onActivate?.({ id: item.id });
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
        testID={`explorer-item-${item.id}`}
      >
        <NativeView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {item.thumbnailUri ? (
            <Image source={item.thumbnailUri} accessibilityLabel={item.name} aspectRatio={1} width="100%" />
          ) : <Icon name={item.kind === 'folder' ? 'folder-outline' : 'document-outline'} size={32} />}
        </NativeView>
        <Text variant="caption" numberOfLines={1}>{item.name}</Text>
      </NativePressable>
    );
  };

  if (errorText) return <Text testID={testID}>{errorText}</Text>;
  if (loading) return <Text testID={testID}>Loading…</Text>;
  if (items.length === 0) return <Text testID={testID}>{emptyText}</Text>;

  return (
    <TileGrid
      height={height}
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
