import { Stack } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { TreeItem } from './TreeItem';
import type { TreeViewProps } from './types';

function TreeViewInner<TId extends string = string>({
  themeId: _themeId,
  mode: _mode,
  nodes,
  selectedId,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  onSelect,
  onExpandedChange,
  renderItem,
  testID,
}: TreeViewProps<TId>) {
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<readonly TId[]>(
    defaultExpandedIds ?? [],
  );

  const isControlled = controlledExpandedIds !== undefined;
  const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds;

  const handleToggleExpand = (id: TId) => {
    const isExpanded = expandedIds.includes(id);
    const newIds = isExpanded ? expandedIds.filter((eid) => eid !== id) : [...expandedIds, id];

    if (!isControlled) {
      setInternalExpandedIds(newIds);
    }
    onExpandedChange?.(newIds);
  };

  return (
    <Stack gap="none" testID={testID}>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          depth={0}
          expandedIds={expandedIds}
          node={node}
          onSelect={onSelect}
          onToggleExpand={handleToggleExpand}
          renderItem={renderItem}
          selectedId={selectedId}
        />
      ))}
    </Stack>
  );
}

export const TreeView = withZoraThemeScope(TreeViewInner);
