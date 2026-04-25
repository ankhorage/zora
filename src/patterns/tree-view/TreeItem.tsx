import { Box, Stack } from '@ankhorage/surface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';

import type { TreeItemNode, TreeItemRenderProps } from './types';

interface TreeItemProps<TId extends string = string> {
  node: TreeItemNode<TId>;
  depth: number;
  selectedId?: TId;
  expandedIds: readonly TId[];
  onSelect?: (id: TId) => void;
  onToggleExpand: (id: TId) => void;
  renderItem?: (props: TreeItemRenderProps<TId>) => React.ReactNode;
}

export function TreeItem<TId extends string = string>({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggleExpand,
  renderItem,
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
      <Pressable
        onPress={() => onSelect?.(node.id)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 8,
          borderRadius: 8,
          backgroundColor: isSelected
            ? 'rgba(0,0,0,0.05)'
            : pressed
              ? 'rgba(0,0,0,0.02)'
              : 'transparent',
        })}
      >
        <Text style={{ fontWeight: isSelected ? '600' : '400', color: '#1e293b' }}>
          {node.label}
        </Text>
        <Stack direction="row" gap="xs" align="center">
          {node.actions}
          {hasChildren ? (
            <Pressable
              onPress={() => onToggleExpand(node.id)}
              style={{ padding: 4 }}
              accessibilityLabel={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Ionicons
                name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                size={16}
                color="#64748b"
              />
            </Pressable>
          ) : null}
        </Stack>
      </Pressable>
    );
  };

  return (
    <Box>
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
