import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../../metadata/componentMeta';

test('TimePicker exposes a serializable manifest contract through the shared BottomSheet', async () => {
  const source = await Bun.file('src/features/time-picker/adapters/inbound/TimePicker.tsx').text();
  const meta = ZORA_COMPONENT_META.TimePicker;

  expect(meta.directManifestNode).toBe(true);
  expect(meta.props.value?.type).toBe('string');
  expect(meta.events?.valueChange?.eventType).toBe('timePicker.valueChange');
  expect(meta.bindings?.props?.value?.value.type).toBe('string');
  expect(source).toContain('useBottomSheet()');
});
