import type { KeyboardEvent } from 'react';

/*** Support Space and directional navigation for web radio options without affecting native presses. */
export function handleRadioOptionKeyDown(
  event: KeyboardEvent<RadioOptionKeyboardTarget>,
  select: () => void,
): void {
  if (event.key === ' ') {
    event.preventDefault();
    select();
    return;
  }
  const direction = new Map([
    ['ArrowRight', 1],
    ['ArrowDown', 1],
    ['ArrowLeft', -1],
    ['ArrowUp', -1],
  ]).get(event.key);
  if (direction === undefined) return;
  const group = event.currentTarget.closest('[role="radiogroup"]');
  const options = Array.from(group?.querySelectorAll('[role="radio"]') ?? []).filter(
    (option) => option.getAttribute('aria-disabled') !== 'true',
  );
  const index = options.indexOf(event.currentTarget);
  if (index < 0 || options.length === 0) return;
  event.preventDefault();
  const next = options.at((index + direction + options.length) % options.length);
  next?.focus();
  next?.click();
}

/** Minimal web target contract keeps the native build independent of DOM ambient libraries. */
export interface RadioOptionKeyboardTarget {
  closest(
    selector: string,
  ): { querySelectorAll(selector: string): ArrayLike<RadioOptionKeyboardTarget> } | null;
  getAttribute(name: string): string | null;
  focus(): void;
  click(): void;
}
