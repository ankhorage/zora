import React from 'react';

import type { ZoraBaseProps } from '../../../../types/base';
import type { TreeItemNode, TreeItemRenderProps } from '../../../../types/tree-view';
import { IconButton } from '../../../button/public';
import { Icon } from '../../../icon/public';
import { View } from '../../../layout/public';
import { ListItem } from '../../../list/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

interface TreeItemProps<TId extends string = string> extends ZoraBaseProps {
  node: TreeItemNode<TId>;
  depth: number;
  expansionIndicator: 'chevron' | 'folder';
  selectedId?: TId;
  expandedIds: readonly TId[];
  onSelect?: (id: TId) => void;
  onToggleExpand: (id: TId) => void;
  renderItem?: (props: TreeItemRenderProps<TId>) => React.ReactNode;
}

/*** Render one recursive themed tree row and keep row selection separate from expansion controls. */
function TreeItemInner<TId extends string = string>({
  themeId: _themeId,
  mode: _mode,
  node,
  depth,
  expansionIndicator,
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

  /*** Compose custom content or the selectable row independently of the expansion control. */
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

    const listItemProps = {
      title: node.label,
      leading:
        expansionIndicator === 'folder' || node.icon === undefined ? undefined : (
          <Icon {...node.icon} size="s" />
        ),
      meta: node.meta,
      disabled: node.disabled,
      selected: isSelected,
      trailing: node.actions,
    };

    return onSelect === undefined ? (
      <ListItem {...listItemProps} />
    ) : (
      <ListItem {...listItemProps} onPress={() => onSelect(node.id)} />
    );
  };

  return (
    <View testID={testID}>
      <View direction="row" align="center" style={{ paddingLeft: depth * 16 }}>
        {hasChildren ? (
          <IconButton
            icon={{
              name:
                expansionIndicator === 'folder'
                  ? isExpanded
                    ? 'folder-open-outline'
                    : 'folder-outline'
                  : isExpanded
                    ? 'chevron-down-outline'
                    : 'chevron-forward-outline',
            }}
            disabled={node.disabled}
            interactionPolicy={interactionPolicy}
            label={isExpanded ? 'Collapse' : 'Expand'}
            onPress={() => onToggleExpand(node.id)}
            size="s"
            variant="ghost"
          />
        ) : (
          <View style={{ width: 32 }} align="center">
            {expansionIndicator === 'folder' ? <Icon name="document-outline" size="s" /> : null}
          </View>
        )}
        <View style={{ flex: 1, minWidth: 0 }}>{renderContent()}</View>
      </View>
      {hasChildren && isExpanded ? (
        <View>
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              depth={depth + 1}
              expandedIds={expandedIds}
              expansionIndicator={expansionIndicator}
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

/*** Single tree node row used within `TreeView`. */
export const TreeItem = withZoraThemeScope(TreeItemInner);
