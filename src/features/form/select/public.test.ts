import { expect, test } from 'bun:test';

import type { SelectProps } from '../../../types/select';
import { selectMeta } from './selectMeta';

test('Select is a direct manifest node with valueChange payload', () => {
  expect(selectMeta.directManifestNode).toBe(true);
  expect(selectMeta.events.valueChange.eventType).toBe('select.valueChange');
  expect(selectMeta.events.valueChange.payloadFields).toEqual([
    { path: 'value', type: 'string', label: 'Value' },
  ]);
});

test('Select registers the optional leading icon as instance-owned media metadata', () => {
  expect(selectMeta.props.leadingIcon).toEqual({
    type: 'media',
    category: 'Content',
    label: 'Leading SVG icon',
    mediaKinds: ['image'],
    authoring: { authority: 'instance' },
  });
});

test('Select registers leading images for the trigger and individual options', () => {
  expect(selectMeta.props.leadingMedia).toEqual({
    type: 'media',
    category: 'Content',
    label: 'Leading image',
    mediaKinds: ['image'],
    authoring: { authority: 'instance' },
  });
  expect(selectMeta.props.options.itemSchema).toContainEqual({
    key: 'leadingMedia',
    schema: {
      type: 'media',
      category: 'Content',
      label: 'Leading image',
      mediaKinds: ['image'],
    },
  });
});

test('Select registers optional trigger label emphasis as serializable metadata', () => {
  expect(selectMeta.props.labelWeight).toEqual({
    type: 'string',
    category: 'Style',
    label: 'Label weight',
    enum: ['semiBold', 'bold'],
    default: 'semiBold',
    authoring: { authority: 'instance' },
  });
});

test('Select is exported through its public component entrypoint', async () => {
  const publicEntry = await Bun.file('src/features/form/select/public.ts').text();

  expect(publicEntry).toContain(
    "export type { SelectOption, SelectProps } from '../../../types/select';",
  );
  expect(publicEntry).toContain("export { Select } from './adapters/inbound/Select';");
});

test('Select uses web Popover and native BottomSheetFlatList presentation', async () => {
  const [neutral, web, native] = await Promise.all([
    Bun.file('src/features/form/select/adapters/inbound/Select.tsx').text(),
    Bun.file('src/features/form/select/adapters/inbound/Select.web.tsx').text(),
    Bun.file('src/features/form/select/adapters/inbound/Select.native.tsx').text(),
  ]);

  expect(neutral).toContain("export { Select } from './Select.web';");
  expect(web).toContain("import { Popover } from '@ankhorage/surface';");
  expect(native).toContain('<BottomSheetFlatList');
  expect(native).toContain("contentMode: 'direct'");
  expect(web).toContain('leadingMedia={selectedOption?.leadingMedia}');
  expect(native).toContain('leadingMedia={selectedOption?.leadingMedia}');
  expect(`${neutral}\n${web}\n${native}`).not.toContain('@react-native-picker/picker');
});

test('Select supports label emphasis, SVG icons, and leading images', async () => {
  const props: SelectProps = {
    options: [{ label: 'Workspace', value: 'workspace' }],
  };
  const svgIcon = {
    source:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3C/svg%3E',
  } as const;
  const configurations = [
    props,
    { ...props, labelWeight: 'bold' },
    { ...props, leadingIcon: svgIcon },
    { ...props, labelWeight: 'bold', leadingIcon: svgIcon },
  ] satisfies readonly SelectProps[];
  const imageSource = { uri: 'https://cdn.example.test/atlas-option.png' } as const;
  const mediaConfigurations = [
    { ...props, leadingMedia: imageSource },
    { ...props, options: [{ label: 'Workspace', value: 'workspace', leadingMedia: imageSource }] },
  ] satisfies readonly SelectProps[];
  const selectTrigger = await Bun.file(
    'src/features/form/select/composition/SelectTrigger.tsx',
  ).text();
  const selectOptionRow = await Bun.file(
    'src/features/form/select/composition/SelectOptionRow.tsx',
  ).text();

  expect(configurations).toHaveLength(4);
  expect(mediaConfigurations).toHaveLength(2);
  expect(selectTrigger).toContain("labelWeight={props.labelWeight ?? 'semiBold'}");
  expect(selectTrigger).toContain('leadingIcon={props.leadingIcon}');
  expect(selectTrigger).toContain('source={media}');
  expect(selectOptionRow).toContain('source={option.leadingMedia}');
});
