import type React from 'react';

/*** Bridge browser keyboard events into the matrix's platform-neutral focus policy. */
export function MatrixGridKeyboardProxy({ children, onKeyDown }: MatrixGridKeyboardProxyProps) {
  return (
    <div
      onKeyDownCapture={(event) => {
        if (isNestedInteractiveElement(event.target, event.currentTarget)) return;
        if (onKeyDown(event)) event.preventDefault();
      }}
      style={{ display: 'flex', flex: 1 }}
    >
      {children}
    </div>
  );
}

/*** Leave editable and independently interactive cell content in control of its own keyboard events. */
function isNestedInteractiveElement(target: EventTarget, boundary: EventTarget): boolean {
  if (target === boundary || !hasClosest(target)) return false;
  const interactiveElement = target.closest(interactiveSelector);
  return interactiveElement !== null && interactiveElement !== getFirstElementChild(boundary);
}

/*** Recognize the browser-only closest capability without leaking DOM globals into shared code. */
function hasClosest(
  target: EventTarget,
): target is EventTarget & { closest: (selector: string) => unknown } {
  return 'closest' in target && typeof target.closest === 'function';
}

/*** Exempt the cell's own Pressable while preserving keyboard ownership for nested controls. */
function getFirstElementChild(boundary: EventTarget): unknown {
  return 'firstElementChild' in boundary ? boundary.firstElementChild : undefined;
}

const interactiveSelector =
  'a, button, input, select, textarea, [contenteditable="true"], [role="button"], [role="checkbox"], [role="combobox"], [role="link"], [role="menuitem"], [role="option"], [role="slider"], [role="spinbutton"], [role="switch"], [role="tab"]';

interface MatrixGridKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
}
