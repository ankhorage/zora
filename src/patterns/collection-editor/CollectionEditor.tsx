import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { Button } from '../../components/button';
import { IconButton } from '../../components/icon-button';
import { Text } from '../../components/text';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Panel } from '../panel';
import type { CollectionEditorProps } from './types';

function CollectionEditorInner<TItem>({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  items,
  renderItem,
  onAdd,
  onRemove,
  onMove,
  addLabel = 'Add Item',
  emptyLabel = 'No items yet.',
  disabled,
  testID,
}: CollectionEditorProps<TItem>) {
  const isEmpty = items.length === 0;

  return (
    <Panel
      compact
      description={description}
      testID={testID}
      title={title}
      actions={
        onAdd ? (
          <Button emphasis="soft" size="s" disabled={disabled} onPress={onAdd}>
            {addLabel}
          </Button>
        ) : null
      }
    >
      <Stack gap="s">
        {isEmpty ? (
          <Box py="m">
            <Text align="center" tone="muted">
              {emptyLabel}
            </Text>
          </Box>
        ) : (
          items.map((item, index) => (
            <Box key={index} bg="subtle" p="s" radius="m" borderColor="border" borderWidth={1}>
              <Stack direction="row" gap="m" align="center">
                <Box flex={1}>
                  {renderItem({
                    item,
                    index,
                    remove: () => onRemove?.(index),
                    moveUp: () => onMove?.(index, index - 1),
                    moveDown: () => onMove?.(index, index + 1),
                    canMoveUp: index > 0,
                    canMoveDown: index < items.length - 1,
                  })}
                </Box>
                <Stack direction="row" gap="xs">
                  {onMove ? (
                    <>
                      <IconButton
                        icon={{ name: 'arrow-up-outline' }}
                        label="Move Up"
                        disabled={disabled ?? index === 0}
                        onPress={() => onMove(index, index - 1)}
                        size="s"
                        emphasis="ghost"
                      />
                      <IconButton
                        icon={{ name: 'arrow-down-outline' }}
                        label="Move Down"
                        disabled={disabled ?? index === items.length - 1}
                        onPress={() => onMove(index, index + 1)}
                        size="s"
                        emphasis="ghost"
                      />
                    </>
                  ) : null}
                  {onRemove ? (
                    <IconButton
                      icon={{ name: 'trash-outline' }}
                      label="Remove"
                      tone="danger"
                      disabled={disabled}
                      onPress={() => onRemove(index)}
                      size="s"
                      emphasis="ghost"
                    />
                  ) : null}
                </Stack>
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Panel>
  );
}

export const CollectionEditor = withZoraThemeScope(CollectionEditorInner);
