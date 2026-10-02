import { expect, test } from 'bun:test';

import { datePickerMeta } from './datePickerMeta';

test('DatePicker keeps one manifest contract across native and web presentation hosts', async () => {
  const nativeSource = await Bun.file(
    'src/features/date-picker/adapters/inbound/DatePicker.native.tsx',
  ).text();
  const webSource = await Bun.file(
    'src/features/date-picker/adapters/inbound/DatePicker.web.tsx',
  ).text();
  const contentSource = await Bun.file(
    'src/features/date-picker/composition/DatePickerContent.tsx',
  ).text();

  expect(datePickerMeta.directManifestNode).toBe(true);
  expect(datePickerMeta.props.value.type).toBe('string');
  expect(datePickerMeta.events.valueChange.eventType).toBe('datePicker.valueChange');
  expect(nativeSource).toContain('useBottomSheet()');
  expect(webSource).toContain('<Popover');
  expect(webSource).not.toContain('useBottomSheet');
  expect(contentSource).toContain('DatePickerCalendar');
});
