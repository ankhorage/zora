import {
  type InteractionModifiers,
  resolveSelectionIntent,
  type SelectionActivationKind,
  type SelectionInteractionInput,
} from '@ankhorage/utility/interaction';
import { isRecord } from '@ankhorage/utility/object';
import type { SelectionIntent } from '@ankhorage/utility/selection';

/*** Normalize DOM, React Native, and renderer events into one semantic selection intent. */
export function resolveSelectionEventIntent(
  event: unknown,
  fallbackKind: SelectionActivationKind,
): SelectionIntent {
  const source = readEventSource(event);
  const kind: SelectionActivationKind = isTouchActivation(source) ? 'touch' : fallbackKind;
  const sourceModifiers = readInteractionModifiers(source);
  const wrapperModifiers = readInteractionModifiers(event);
  const input: SelectionInteractionInput = {
    kind,
    modifiers: {
      altKey: sourceModifiers.altKey === true || wrapperModifiers.altKey === true,
      ctrlKey: sourceModifiers.ctrlKey === true || wrapperModifiers.ctrlKey === true,
      metaKey: sourceModifiers.metaKey === true || wrapperModifiers.metaKey === true,
      shiftKey: sourceModifiers.shiftKey === true || wrapperModifiers.shiftKey === true,
    },
  };
  return resolveSelectionIntent(input);
}

/*** Prefer one nested native/renderer event while preserving structural event compatibility. */
function readEventSource(event: unknown): Readonly<Record<string, unknown>> {
  if (!isRecord(event)) return {};
  if (isRecord(event.originalEvent)) return event.originalEvent;
  if (isRecord(event.nativeEvent)) return event.nativeEvent;
  return event;
}

/*** Recognize pointer and native/browser touch event shapes without depending on platform event types. */
function isTouchActivation(source: Readonly<Record<string, unknown>>): boolean {
  if (source.pointerType === 'touch') return true;
  if (typeof source.type === 'string' && source.type.startsWith('touch')) return true;
  return 'touches' in source || 'changedTouches' in source;
}

/*** Read known modifiers explicitly so arbitrary event properties never become dynamic input keys. */
function readInteractionModifiers(value: unknown): InteractionModifiers {
  if (!isRecord(value)) return {};
  return {
    altKey: value.altKey === true,
    ctrlKey: value.ctrlKey === true,
    metaKey: value.metaKey === true,
    shiftKey: value.shiftKey === true,
  };
}
