import React from 'react';

import { IconButton } from '../../features/button/public';
import { View } from '../../features/layout/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';
import { SettingsRow } from '../settings-row';
import type { TreeItemNode, TreeItemRenderProps } from './types';

interface TreeItemProps<TId extends string = string> extends ZoraBaseProps {
  node: TreeItemNode<TId>;
  depth: number;
  selectedId?: TId;
  expandedIds: readonly TId[];
  onSelect?: (id: TId) => void;
  onToggleExpand: (id: TId) => void;
  renderItem?: (props: TreeItemRenderProps<TId>) => React.ReactNode;
}

function TreeItemInner<TId extends string = string>({
  themeId: _themeId,
  mode: _mode,
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggleExpand,
  renderItem,
  testID,
  interactionPolicy,
}: TreeItemProps<TId>) {
  const hasChildren = node.children !== undefined && node.children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected = selectedId === node.id;

  const renderContent = () => {
    if (renderItem) {
      return renderItem({
        node,
        depth,
        selected: isSelected,
        expanded: isExpanded,
        hasChildren,
      });
    }

    return (
      <SettingsRow
        title={node.label}
        control={
          <View direction="row" gap="xs" align="center">
            {node.actions}
            {hasChildren ? (
              <IconButton
                icon={{ name: isExpanded ? 'chevron-down-outline' : 'chevron-forward-outline' }}
                interactionPolicy={interactionPolicy}
                label={isExpanded ? 'Collapse' : 'Expand'}
                onPress={() => onToggleExpand(node.id)}
                size="s"
                variant="ghost"
              />
            ) : null}
          </View>
        }
        meta={node.meta}
        disabled={node.disabled}
      />
    );
  };

  return (
    <View testID={testID}>
      <View style={{ paddingLeft: depth * 16 }}>{renderContent()}</View>
      {hasChildren && isExpanded ? (
        <View>
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              depth={depth + 1}
              expandedIds={expandedIds}
              interactionPolicy={interactionPolicy}
              node={child}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              renderItem={renderItem}
              selectedId={selectedId}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

/***
 * Single tree node row used within `TreeView`.
 *
 
 */
export const TreeItem = withZoraThemeScope(TreeItemInner);
