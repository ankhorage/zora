import React from 'react';

import type { ColorPickerProps, ColorPickerTab } from '../../types/color';
import { Tab, TabList, TabPanel, Tabs } from '../tabs/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { ColorHueScale } from './ColorHueScale';
import { ColorTone } from './ColorTone';
import { ColorWheel } from './ColorWheel';

/*** Composes independently usable color controls into an ordered, consumer-configured picker. */
export const ColorPicker = withZoraThemeScope(ColorPickerInner);

/*** Coordinates tab visibility only; color values remain controlled by their owning consumer. */
function ColorPickerInner({
  themeId: _themeId,
  mode: _mode,
  inverted: _inverted,
  tabs,
  value,
  onValueChange,
  hideTabListWhenSingle = true,
  wheel,
  tone,
  hue,
  testID,
}: ColorPickerProps) {
  if (tabs.length === 0) throw new Error('ColorPicker requires at least one tab.');
  if (!tabs.includes(value)) throw new Error('ColorPicker value must be configured in tabs.');

  return (
    <Tabs
      defaultValue={value}
      onValueChange={(nextValue) => {
        if (isColorPickerTab(nextValue) && tabs.includes(nextValue)) onValueChange(nextValue);
      }}
      testID={testID}
      value={value}
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
          {resolveTabContent(tab, wheel, tone, hue)}
        </TabPanel>
      ))}
    </Tabs>
  );
}

/*** Check whether a Surface tab value belongs to the configured picker vocabulary. */
function isColorPickerTab(value: string): value is ColorPickerTab {
  return value === 'wheel' || value === 'tone' || value === 'hue';
}

/*** Resolve the configured control for one picker tab without adding fallback feature modes. */
function resolveTabContent(
  tab: ColorPickerTab,
  wheel: ColorPickerProps['wheel'],
  tone: ColorPickerProps['tone'],
  hue: ColorPickerProps['hue'],
) {
  if (tab === 'wheel') return wheel ? <ColorWheel {...wheel} /> : null;
  if (tab === 'tone') return tone ? <ColorTone {...tone} /> : null;
  return hue ? <ColorHueScale {...hue} /> : null;
}
