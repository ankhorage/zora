import { expect, test } from 'bun:test';

import { createGraphPointerDownReader } from './createGraphPointerDownReader';

test('uses a Ctrl pointer snapshot only for its matching renderer pointer activation', () => {
  const reader = createGraphPointerDownReader();
  const pointerDown = { ctrlKey: true, pointerId: 7 };

  reader.write(pointerDown);

  expect(reader.read({ originalEvent: { pointerId: 7 } })).toBe(pointerDown);
  expect(reader.read({ originalEvent: { pointerId: 7 } })).toBeNull();
});

test('discards a Meta pointer snapshot for unrelated touch, keyboard, programmatic, and mouse events', () => {
  const unrelatedEvents = [
    { originalEvent: { pointerId: 8, pointerType: 'touch' } },
    { originalEvent: { key: 'Enter', type: 'keydown' } },
    {},
    { originalEvent: { pointerId: 9, pointerType: 'mouse' } },
  ];

  for (const event of unrelatedEvents) {
    const reader = createGraphPointerDownReader();
    reader.write({ metaKey: true, pointerId: 7 });
    expect(reader.read(event)).toBeNull();
  }
});
