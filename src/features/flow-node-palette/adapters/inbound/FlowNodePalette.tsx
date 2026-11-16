import React from 'react';
import { Pressable } from 'react-native';

import type { FlowNodePaletteProps } from '../../../../types/flow-ui';
import { Card } from '../../../card/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Heading, Text } from '../../../typography/public';
import { FlowNodePaletteKeyboardProxy } from './FlowNodePaletteKeyboardProxy';

/** Presents a controlled, keyboard and touch accessible catalogue of nodes. */
export const FlowNodePalette = withZoraThemeScope(FlowNodePaletteInner);

/** Renders palette state while keeping insertion and focus ownership with the host. */
function FlowNodePaletteInner({
  items,
  selectedItemId,
  focusedItemId,
  disabled = false,
  interactionPolicy,
  onFocusChange,
  onInsert,
  onSelectionChange,
  testID,
}: FlowNodePaletteProps) {
  const { theme } = useZoraTheme();
  const passive = disabled || interactionPolicy === 'passive';
  const enabledItems = items.filter((item) => !item.disabled);

  return (
    <View accessibilityRole="list" gap="s" testID={testID}>
      {items.map((item) => {
        const selected = item.id === selectedItemId;
        const focused = item.id === focusedItemId;
        const itemDisabled = passive || item.disabled === true;
        return (
          <FlowNodePaletteKeyboardProxy
            key={item.id}
            onKeyDown={(key) => {
              const next = resolvePaletteFocus(item.id, enabledItems, key);
              if (next !== item.id) {
                onFocusChange?.(next);
                return true;
              }
              return false;
            }}
          >
            <Pressable
              accessibilityLabel={
                item.description ? `${item.title}. ${item.description}` : item.title
              }
              accessibilityRole="button"
              accessibilityState={{ disabled: itemDisabled, selected }}
              disabled={itemDisabled}
              onFocus={() => onFocusChange?.(item.id)}
              onLongPress={() => onSelectionChange?.(item.id)}
              onPress={() => {
                onSelectionChange?.(item.id);
                onInsert?.(item.id);
              }}
              style={{ minHeight: 44 }}
              testID={`${testID ?? 'flow-node-palette'}-${item.id}`}
            >
              <Card
                compact
                disabled={itemDisabled}
                style={{
                  borderColor:
                    selected || focused ? theme.colors.primary : theme.semantics.neutral.divider,
                  borderWidth: selected || focused ? 2 : 1,
                }}
                tone="subtle"
              >
                <View gap="xxs" p="s">
                  <Heading level={5}>{item.title}</Heading>
                  {item.description ? <Text emphasis="muted">{item.description}</Text> : null}
                </View>
              </Card>
            </Pressable>
          </FlowNodePaletteKeyboardProxy>
        );
      })}
    </View>
  );
}

/** Resolves roving focus without retaining focus state inside the controlled palette. */
function resolvePaletteFocus(
  currentId: string,
  items: readonly { readonly id: string }[],
  key: string,
): string {
  const currentIndex = items.findIndex((item) => item.id === currentId);
  if (currentIndex < 0 || items.length === 0) return currentId;
  if (key === 'Home') return items[0]?.id ?? currentId;
  if (key === 'End') return items.at(-1)?.id ?? currentId;
  if (key !== 'ArrowDown' && key !== 'ArrowRight' && key !== 'ArrowUp' && key !== 'ArrowLeft') {
    return currentId;
  }
  const offset = key === 'ArrowDown' || key === 'ArrowRight' ? 1 : -1;
  return items[(currentIndex + offset + items.length) % items.length]?.id ?? currentId;
}
