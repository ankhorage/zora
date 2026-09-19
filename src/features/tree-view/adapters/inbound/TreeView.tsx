import React from 'react';

import type { TreeViewProps } from '../../../../types/tree-view';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { toggleExpandedIds } from '../../utils/toggleExpandedIds';
import { TreeItem } from './TreeItem';

/*** Render the themed TreeView while supporting controlled or internal expansion state. */
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
  interactionPolicy,
}: TreeViewProps<TId>) {
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<readonly TId[]>(
    defaultExpandedIds ?? [],
  );

  const isControlled = controlledExpandedIds !== undefined;
  const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds;

  const handleToggleExpand = (id: TId) => {
    if (interactionPolicy === 'passive') return;
    const nextExpandedIds = toggleExpandedIds(expandedIds, id);

    if (!isControlled) {
      setInternalExpandedIds(nextExpandedIds);
    }
    onExpandedChange?.(nextExpandedIds);
  };

  return (
    <View gap="none" testID={testID}>
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
          interactionPolicy={interactionPolicy}
        />
      ))}
    </View>
  );
}

/*** Tree view pattern for hierarchical navigation and expandable lists. */
export const TreeView = withZoraThemeScope(TreeViewInner);
