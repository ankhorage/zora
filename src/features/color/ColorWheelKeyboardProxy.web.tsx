import type React from 'react';

import type { ColorWheelKeyboardProxyProps } from './ColorWheelKeyboardProxy';

/*** Bridges browser keyboard input to controlled OKLCH wheel hue and chroma changes. */
export function ColorWheelKeyboardProxy({
  children,
  chroma,
  disabled,
  hue,
  maxChroma = 0.2,
  onChange,
}: ColorWheelKeyboardProxyProps) {
  return (
    <div
      aria-label={`Color wheel, hue ${Math.round(hue)}, chroma ${chroma.toFixed(2)}`}
      aria-valuemax={360}
      aria-valuemin={0}
      aria-valuenow={Math.round(hue)}
      aria-valuetext={`Hue ${Math.round(hue)}, chroma ${chroma.toFixed(2)}`}
      aria-disabled={disabled}
      onKeyDown={(event) => {
        const nextValue = resolveKeyboardWheelValue(event.key, hue, chroma, maxChroma);
        if (!nextValue || disabled) return;
        event.preventDefault();
        onChange(nextValue.hue, nextValue.chroma);
      }}
      role="slider"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
}

/*** Resolve portable arrow keys into bounded color-wheel increments. */
function resolveKeyboardWheelValue(key: string, hue: number, chroma: number, maxChroma: number) {
  if (key === 'ArrowLeft') return { chroma, hue: normalizeHue(hue - 5) };
  if (key === 'ArrowRight') return { chroma, hue: normalizeHue(hue + 5) };
  if (key === 'ArrowDown') return { chroma: Math.max(0, chroma - 0.02), hue };
  if (key === 'ArrowUp') return { chroma: Math.min(maxChroma, chroma + 0.02), hue };
  return undefined;
}

/*** Normalize keyboard hue increments to the slider's documented range. */
function normalizeHue(hue: number): number {
  return hue < 0 ? hue + 360 : hue >= 360 ? hue - 360 : hue;
}
