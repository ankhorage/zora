import React from 'react';

import { IconButton } from '../../components/icon-button';
import { Box, Stack } from '../../foundation';
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
          <Stack direction="row" gap="xs" align="center">
            {node.actions}
            {hasChildren ? (
              <IconButton
                icon={{ name: isExpanded ? 'chevron-down-outline' : 'chevron-forward-outline' }}
                label={isExpanded ? 'Collapse' : 'Expand'}
                onPress={() => onToggleExpand(node.id)}
                size="s"
                emphasis="ghost"
              />
            ) : null}
          </Stack>
        }
        meta={node.meta}
        disabled={node.disabled}
      />
    );
  };

  return (
    <Box testID={testID}>
      <Box style={{ paddingLeft: depth * 16 }}>{renderContent()}</Box>
      {hasChildren && isExpanded ? (
        <Box>
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              depth={depth + 1}
              expandedIds={expandedIds}
              node={child}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              renderItem={renderItem}
              selectedId={selectedId}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export const TreeItem = withZoraThemeScope(TreeItemInner);
