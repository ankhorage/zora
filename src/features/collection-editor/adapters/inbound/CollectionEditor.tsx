import React from 'react';

import type { CollectionEditorProps } from '../../../../types/collection-editor';
import { Button } from '../../../button/public';
import { IconButton } from '../../../button/public';
import { Card } from '../../../card/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Text } from '../../../typography/public';

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
  interactionPolicy,
}: CollectionEditorProps<TItem>) {
  const isEmpty = items.length === 0;

  return (
    <Card
      compact
      description={description}
      interactionPolicy={interactionPolicy}
      testID={testID}
      title={title}
      actions={
        onAdd ? (
          <Button
            variant="soft"
            size="s"
            disabled={disabled}
            interactionPolicy={interactionPolicy}
            onPress={onAdd}
          >
            {addLabel}
          </Button>
        ) : null
      }
    >
      <View gap="s">
        {isEmpty ? (
          <View py="m">
            <Text align="center" emphasis="muted">
              {emptyLabel}
            </Text>
          </View>
        ) : (
          items.map((item, index) => (
            <View key={index} bg="subtle" p="s" radius="m" borderColor="border" borderWidth={1}>
              <View direction="row" gap="m" align="center">
                <View flex={1}>
                  {renderItem({
                    item,
                    index,
                    remove: () => onRemove?.(index),
                    moveUp: () => onMove?.(index, index - 1),
                    moveDown: () => onMove?.(index, index + 1),
                    canMoveUp: index > 0,
                    canMoveDown: index < items.length - 1,
                  })}
                </View>
                <View direction="row" gap="xs">
                  {onMove ? (
                    <>
                      <IconButton
                        icon={{ name: 'arrow-up-outline' }}
                        label="Move Up"
                        disabled={disabled ?? index === 0}
                        interactionPolicy={interactionPolicy}
                        onPress={() => onMove(index, index - 1)}
                        size="s"
                        variant="ghost"
                      />
                      <IconButton
                        icon={{ name: 'arrow-down-outline' }}
                        label="Move Down"
                        disabled={disabled ?? index === items.length - 1}
                        interactionPolicy={interactionPolicy}
                        onPress={() => onMove(index, index + 1)}
                        size="s"
                        variant="ghost"
                      />
                    </>
                  ) : null}
                  {onRemove ? (
                    <IconButton
                      icon={{ name: 'trash-outline' }}
                      label="Remove"
                      color="danger"
                      disabled={disabled}
                      interactionPolicy={interactionPolicy}
                      onPress={() => onRemove(index)}
                      size="s"
                      variant="ghost"
                    />
                  ) : null}
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </Card>
  );
}

/***
 * Editor pattern for adding, removing, and reordering a collection of items.
 *
 
 */
export const CollectionEditor = withZoraThemeScope(CollectionEditorInner);
