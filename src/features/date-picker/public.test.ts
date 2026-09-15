import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../authoring/componentMeta';

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
  const meta = ZORA_COMPONENT_META.DatePicker;

  expect(meta.directManifestNode).toBe(true);
  expect(meta.props.value?.type).toBe('string');
  expect(meta.events?.valueChange?.eventType).toBe('datePicker.valueChange');
  expect(meta.bindings?.props?.value?.value.type).toBe('string');
  expect(nativeSource).toContain('useBottomSheet()');
  expect(webSource).toContain('<Popover');
  expect(webSource).not.toContain('useBottomSheet');
  expect(contentSource).toContain('DatePickerCalendar');
});
