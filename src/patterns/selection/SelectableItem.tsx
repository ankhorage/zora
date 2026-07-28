import { ButtonBase } from '@ankhorage/surface';
import React from 'react';
import type { GestureResponderEvent } from 'react-native';

import { useSelection } from './SelectionProvider';
import type { SelectableItemProps, SelectableItemState, SelectionTrigger } from './types';

function resolveTrigger(trigger: SelectionTrigger | undefined): SelectionTrigger {
  return trigger ?? 'manual';
}

function isRenderProp(
  children: SelectableItemProps['children'],
): children is (state: SelectableItemState) => React.ReactNode {
  return typeof children === 'function';
}

/***
 * Adds selection behavior to arbitrary child content via render props.
 *
 
 */
export function SelectableItem({
  id,
  trigger,
  disabled = false,
  interactionPolicy,
  children,
}: SelectableItemProps) {
  const selection = useSelection();
  const resolvedTrigger = resolveTrigger(trigger);
  const resolvedDisabled = selection.disabled || disabled;
  const selected = selection.isSelected(id);

  const select = React.useCallback(() => {
    if (resolvedDisabled) return;
    if (interactionPolicy === 'passive') return;
    selection.select(id);
  }, [id, resolvedDisabled, interactionPolicy, selection]);

  const toggle = React.useCallback(() => {
    if (resolvedDisabled) return;
    if (interactionPolicy === 'passive') return;
    selection.toggle(id);
  }, [id, resolvedDisabled, interactionPolicy, selection]);

  const clear = React.useCallback(() => {
    if (selection.disabled) return;
    if (interactionPolicy === 'passive') return;
    selection.clear();
  }, [interactionPolicy, selection]);

  const itemState = React.useMemo<SelectableItemState>(() => {
    return {
      id,
      selected,
      disabled: resolvedDisabled,
      mode: selection.mode,
      select,
      toggle,
      clear,
    };
  }, [clear, id, resolvedDisabled, select, selected, selection.mode, toggle]);

  // IMPORTANT:
  // Do not pass `children` directly into ButtonBase. ButtonBase also supports function children,
  // but its function signature receives interaction state, not SelectableItemState.
  const content = isRenderProp(children) ? children(itemState) : children;

  if (resolvedTrigger === 'manual') {
    return <>{content}</>;
  }

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (resolvedDisabled) return;
    if (interactionPolicy === 'passive') return;
    if (selection.mode === 'single') {
      selection.select(id);
      return;
    }

    selection.toggle(id);
  };

  const handleLongPress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (resolvedDisabled) return;
    if (interactionPolicy === 'passive') return;
    if (selection.mode === 'single') {
      selection.select(id);
      return;
    }

    selection.toggle(id);
  };

  return (
    <ButtonBase
      interactionPolicy={interactionPolicy}
      accessibilityRole="button"
      accessibilityState={{ disabled: resolvedDisabled, selected }}
      disabled={resolvedDisabled}
      onLongPress={resolvedTrigger === 'longPress' ? handleLongPress : undefined}
      onPress={resolvedTrigger === 'press' ? handlePress : undefined}
    >
      {content}
    </ButtonBase>
  );
}
