import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../../metadata/componentMeta';

test('DatePicker exposes a serializable manifest contract through the shared BottomSheet', async () => {
  const source = await Bun.file('src/features/date-picker/adapters/inbound/DatePicker.tsx').text();
  const meta = ZORA_COMPONENT_META.DatePicker;

  expect(meta.directManifestNode).toBe(true);
  expect(meta.props.value?.type).toBe('string');
  expect(meta.events?.valueChange?.eventType).toBe('datePicker.valueChange');
  expect(meta.bindings?.props?.value?.value.type).toBe('string');
  expect(source).toContain('useBottomSheet()');
  expect(source).toContain('formatLocalDate(date)');
});
