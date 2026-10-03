import { Pressable } from '@ankhorage/surface';
import type { SelectionIntent } from '@ankhorage/utility/selection';
import React from 'react';
import { type GestureResponderEvent, Platform } from 'react-native';

import type {
  SelectableItemProps,
  SelectableItemState,
  SelectionTrigger,
} from '../../../../types/selection';
import { resolveSelectionEventIntent } from '../../application/resolveSelectionEventIntent';
import { useSelection } from './SelectionProvider';

/*** Resolve the configured selection trigger. */
function resolveTrigger(trigger: SelectionTrigger | undefined): SelectionTrigger {
  return trigger ?? 'manual';
}

/*** Narrow render-prop children without changing ordinary React-node children. */
function isRenderProp(
  children: SelectableItemProps['children'],
): children is (state: SelectableItemState) => React.ReactNode {
  return typeof children === 'function';
}

/*** Adds selection behavior to arbitrary child content via render props. */
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

  const activate = React.useCallback(
    (intent: SelectionIntent) => {
      if (resolvedDisabled || interactionPolicy === 'passive') return;
      selection.activate(id, intent);
    },
    [id, interactionPolicy, resolvedDisabled, selection],
  );
  const select = React.useCallback(() => {
    if (resolvedDisabled || interactionPolicy === 'passive') return;
    selection.select(id);
  }, [id, interactionPolicy, resolvedDisabled, selection]);
  const toggle = React.useCallback(() => {
    if (resolvedDisabled || interactionPolicy === 'passive') return;
    selection.toggle(id);
  }, [id, interactionPolicy, resolvedDisabled, selection]);
  const clear = React.useCallback(() => {
    if (selection.disabled || interactionPolicy === 'passive') return;
    selection.clear();
  }, [interactionPolicy, selection]);

  const itemState = React.useMemo<SelectableItemState>(
    () => ({
      id,
      selected,
      disabled: resolvedDisabled,
      mode: selection.mode,
      activate,
      select,
      toggle,
      clear,
    }),
    [activate, clear, id, resolvedDisabled, select, selected, selection.mode, toggle],
  );

  const content = isRenderProp(children) ? children(itemState) : children;
  if (resolvedTrigger === 'manual') return <>{content}</>;

  const handleActivation = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (resolvedDisabled || interactionPolicy === 'passive') return;
    selection.activate(
      id,
      resolveSelectionEventIntent(event, Platform.OS === 'web' ? 'pointer' : 'touch'),
    );
  };

  return (
    <Pressable
      interactionPolicy={interactionPolicy}
      accessibilityRole="button"
      accessibilityState={{ disabled: resolvedDisabled, selected }}
      disabled={resolvedDisabled}
      onLongPress={resolvedTrigger === 'longPress' ? handleActivation : undefined}
      onPress={resolvedTrigger === 'press' ? handleActivation : undefined}
    >
      {content}
    </Pressable>
  );
}
