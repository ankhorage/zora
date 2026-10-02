import { expect, test } from 'bun:test';

import { timePickerMeta } from './timePickerMeta';

test('TimePicker keeps one manifest contract across native and web presentation hosts', async () => {
  const nativeSource = await Bun.file(
    'src/features/time-picker/adapters/inbound/TimePicker.native.tsx',
  ).text();
  const webSource = await Bun.file(
    'src/features/time-picker/adapters/inbound/TimePicker.web.tsx',
  ).text();
  const contentSource = await Bun.file(
    'src/features/time-picker/composition/TimePickerContent.tsx',
  ).text();

  expect(timePickerMeta.directManifestNode).toBe(true);
  expect(timePickerMeta.props.value?.type).toBe('string');
  expect(timePickerMeta.events?.valueChange?.eventType).toBe('timePicker.valueChange');
  expect(timePickerMeta.bindings?.props?.value?.value.type).toBe('string');
  expect(nativeSource).toContain('useBottomSheet()');
  expect(webSource).toContain('<Popover');
  expect(webSource).not.toContain('useBottomSheet');
  expect(contentSource).toContain('TimePickerOption');
});
