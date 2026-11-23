import { Button } from '@ankhorage/surface';
import React from 'react';

import type { ColorPickerProps, ColorPickerTab, ColorPickerValue } from '../../types/color';
import { View } from '../layout/public';
import { Tab, TabList, TabPanel, Tabs } from '../tabs/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { ColorHueScale } from './ColorHueScale';
import { ColorTone } from './ColorTone';
import { ColorWheel } from './ColorWheel';

/*** Composes independently usable color controls into an ordered, consumer-configured picker. */
export const ColorPicker = withZoraThemeScope(ColorPickerInner);

/*** Coordinates persistent controlled color selections across independently usable picker tabs. */
function ColorPickerInner({
  themeId: _themeId,
  mode: _mode,
  inverted: _inverted,
  tabs,
  value,
  onValueChange,
  onSelectionChange,
  onDismiss,
  hideTabListWhenSingle = true,
  wheel,
  tone,
  hue,
  testID,
}: ColorPickerProps) {
  if (tabs.length === 0) throw new Error('ColorPicker requires at least one tab.');
  if (!tabs.includes(value.tab)) throw new Error('ColorPicker value must be configured in tabs.');

  return (
    <View
      bg="surfaceRaised"
      borderColor="border"
      borderWidth={1}
      gap="sm"
      p="md"
      radius="lg"
      testID={testID}
    >
      <View align="center" direction="row" justify="space-between">
        <View align="center" direction="row" gap="sm">
          <View
            bg={value.wheel.color}
            borderColor="border"
            borderWidth={1}
            height={32}
            radius="sm"
            width={32}
          />
          <Button variant="ghost">Color</Button>
        </View>
        {onDismiss ? (
          <Button onPress={onDismiss} variant="ghost">
            Close
          </Button>
        ) : null}
      </View>
      <Tabs
        defaultValue={value.tab}
        onValueChange={(nextValue) => {
          if (isColorPickerTab(nextValue) && tabs.includes(nextValue))
            onValueChange({ ...value, tab: nextValue });
        }}
        testID={testID ? `${testID}-tabs` : undefined}
        value={value.tab}
      >
        {tabs.length > 1 || !hideTabListWhenSingle ? (
          <TabList fill>
            {tabs.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </TabList>
        ) : null}
        {tabs.map((tab) => (
          <TabPanel key={tab} value={tab}>
            {resolveTabContent(tab, value, wheel, tone, hue, onValueChange, onSelectionChange)}
          </TabPanel>
        ))}
      </Tabs>
    </View>
  );
}

/*** Check whether a Surface tab value belongs to the configured picker vocabulary. */
function isColorPickerTab(value: string): value is ColorPickerTab {
  return value === 'wheel' || value === 'tone' || value === 'hue';
}

/*** Resolve the configured control for one picker tab without adding fallback feature modes. */
function resolveTabContent(
  tab: ColorPickerTab,
  value: ColorPickerValue,
  wheel: ColorPickerProps['wheel'],
  tone: ColorPickerProps['tone'],
  hue: ColorPickerProps['hue'],
  onValueChange: (value: ColorPickerValue) => void,
  onSelectionChange: ColorPickerProps['onSelectionChange'],
) {
  if (tab === 'wheel')
    return wheel ? (
      <ColorWheel
        {...wheel}
        harmony={value.wheel.harmony}
        onChange={(next) => {
          onValueChange({ ...value, wheel: next });
          onSelectionChange?.({ mode: 'wheel', value: next });
        }}
        value={value.wheel.color}
      />
    ) : null;
  if (tab === 'tone')
    return tone ? (
      <ColorTone
        {...tone}
        onChange={(next) => {
          onValueChange({ ...value, tone: next });
          onSelectionChange?.({ mode: 'tone', value: next });
        }}
        value={value.tone}
      />
    ) : null;
  return hue ? (
    <ColorHueScale
      {...hue}
      onChange={(next) => {
        onValueChange({ ...value, hue: next });
        onSelectionChange?.({ mode: 'hue', value: next });
      }}
      value={value.hue}
    />
  ) : null;
}
