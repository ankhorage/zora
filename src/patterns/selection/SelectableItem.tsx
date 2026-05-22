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
 * @readme
 */
export function SelectableItem({ id, trigger, disabled = false, children }: SelectableItemProps) {
  const selection = useSelection();
  const resolvedTrigger = resolveTrigger(trigger);
  const resolvedDisabled = selection.disabled || disabled;
  const selected = selection.isSelected(id);

  const select = React.useCallback(() => {
    if (resolvedDisabled) return;
    selection.select(id);
  }, [id, resolvedDisabled, selection]);

  const toggle = React.useCallback(() => {
    if (resolvedDisabled) return;
    selection.toggle(id);
  }, [id, resolvedDisabled, selection]);

  const clear = React.useCallback(() => {
    if (selection.disabled) return;
    selection.clear();
  }, [selection]);

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
    if (selection.mode === 'single') {
      selection.select(id);
      return;
    }

    selection.toggle(id);
  };

  const handleLongPress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (resolvedDisabled) return;
    if (selection.mode === 'single') {
      selection.select(id);
      return;
    }

    selection.toggle(id);
  };

  return (
    <ButtonBase
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
