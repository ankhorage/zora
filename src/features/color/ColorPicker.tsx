import { COLOR_HARMONY_CATALOG, type ColorHarmony, type HexColor } from '@ankhorage/color-theory';
import { Pressable } from '@ankhorage/surface';
import React from 'react';
import { View as NativeView } from 'react-native';

import type { ColorPickerProps, ColorPickerTab, ColorToneDefinition } from '../../types/color';
import { IconButton } from '../button/public';
import { Card } from '../card/public';
import { Select } from '../form/select/public';
import { Divider, View } from '../layout/public';
import { Tab, TabList, TabPanel, Tabs } from '../tabs/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../theme/composition/useZoraTheme';
import { Heading } from '../typography/public';
import { ColorHexField } from './ColorHexField';
import { ColorWheel } from './ColorWheel';
import { resolveOklchColor } from './utils/resolveOklchColor';
import { resolveColorPickerGeometry } from './resolveColorPickerGeometry';

const DEFAULT_TABS: readonly ColorPickerTab[] = ['grid', 'wheel'];

/*** Replaces the former Tone/Hue picker with one controlled Grid/Wheel presentation. */
export const ColorPicker = withZoraThemeScope(ColorPickerInner);

/*** Coordinates the shared colour, tone and harmony state across both picker presentations. */
function ColorPickerInner({
  themeId: _themeId,
  mode: _mode,
  inverted: _inverted,
  tabs = DEFAULT_TABS,
  primaryColor,
  harmony,
  tone,
  tones = [],
  width = 560,
  height,
  onInsufficientSpaceChange,
  activeTab,
  onValueChange,
  onActiveTabChange,
  onDismiss,
  hideTabListWhenSingle = true,
  wheel,
  interactionPolicy,
  testID,
}: ColorPickerProps) {
  const { theme } = useZoraTheme();
  const [hostBounds, setHostBounds] = React.useState<{
    readonly height: number;
    readonly width: number;
  }>();
  const enabledTabs = resolveEnabledTabs(tabs);
  const firstTab = enabledTabs.at(0);
  if (!firstTab) throw new Error('ColorPicker requires at least one tab.');
  const resolvedTab = activeTab && enabledTabs.includes(activeTab) ? activeTab : firstTab;
  const geometry = resolveColorPickerGeometry({
    height,
    hostHeight: hostBounds?.height,
    hostWidth: hostBounds?.width,
    showTabs: enabledTabs.length > 1 || !hideTabListWhenSingle,
    width,
  });
  const selectedTone = tones.find((entry) => entry.id === tone);
  const emit = (next: {
    readonly harmony?: ColorHarmony;
    readonly primaryColor?: HexColor;
    readonly tone?: string;
  }) =>
    onValueChange({
      primaryColor: next.primaryColor ?? primaryColor,
      ...(Object.hasOwn(next, 'harmony') ? { harmony: next.harmony } : harmony ? { harmony } : {}),
      ...(Object.hasOwn(next, 'tone') ? { tone: next.tone } : tone ? { tone } : {}),
    });
  const settings = (children: React.ReactNode) => (
    <PickerRow
      geometry={geometry}
      tone={tone}
      tones={tones}
      harmony={harmony}
      interactionPolicy={interactionPolicy}
      onHarmonyChange={(next) => emit({ harmony: next })}
      onToneChange={(next) => emit({ tone: next })}
    >
      {children}
    </PickerRow>
  );
  React.useEffect(() => {
    if (activeTab && activeTab !== resolvedTab) onActiveTabChange?.(resolvedTab);
  }, [activeTab, onActiveTabChange, resolvedTab]);
  React.useEffect(() => {
    onInsufficientSpaceChange?.(geometry.insufficientSpace);
  }, [geometry.insufficientSpace, onInsufficientSpaceChange]);
  return (
    <NativeView
      onLayout={(event) =>
        setHostBounds({
          height: event.nativeEvent.layout.height,
          width: event.nativeEvent.layout.width,
        })
      }
      style={{
        alignSelf: 'stretch',
        flexShrink: 1,
        maxHeight: '100%',
        maxWidth: '100%',
        width: '100%',
      }}
    >
      {!geometry.insufficientSpace ? (
        <View
          alignSelf="center"
          bg={theme.semantics.surface.raised}
          borderColor={theme.semantics.border.default}
          borderWidth={1}
          gap={geometry.footerGap}
          p={geometry.padding}
          radius="xl"
          testID={testID}
          width={geometry.width}
        >
          <View align="center" direction="row" justify="space-between" minHeight={48}>
            <Heading level={2}>Color</Heading>
            <View align="center" direction="row" gap="s">
              <View
                bg={primaryColor}
                borderColor={theme.semantics.border.default}
                borderWidth={1}
                height={36}
                radius="s"
                width={52}
              />
              {onDismiss ? (
                <IconButton iconName="close" label="Close color picker" onPress={onDismiss} />
              ) : null}
            </View>
          </View>
          <Tabs
            onValueChange={(next) => {
              if (isColorPickerTab(next) && enabledTabs.includes(next)) onActiveTabChange?.(next);
            }}
            value={resolvedTab}
            variant="attached"
          >
            {enabledTabs.length > 1 || !hideTabListWhenSingle ? (
              <View
                borderColor={theme.semantics.border.default}
                borderWidth={1}
                overflow="hidden"
                radius="m"
              >
                <TabList fill>
                  {enabledTabs.map((tab) => (
                    <Tab key={tab} label={tab === 'grid' ? 'Grid' : 'Wheel'} value={tab} />
                  ))}
                </TabList>
              </View>
            ) : null}
            {enabledTabs.includes('grid') ? (
              <TabPanel value="grid">
                {settings(
                  <ColorGrid
                    disabled={interactionPolicy === 'passive'}
                    onSelect={(color) => emit({ primaryColor: color })}
                    palette={resolvePalette(selectedTone)}
                    selectionBorderColor={theme.semantics.content.default}
                    selected={primaryColor}
                    size={geometry.stage}
                  />,
                )}
              </TabPanel>
            ) : null}
            {enabledTabs.includes('wheel') ? (
              <TabPanel value="wheel">
                {settings(
                  <ColorWheel
                    {...wheel}
                    harmony={harmony ?? null}
                    onChange={(next) =>
                      emit({ primaryColor: next.color, harmony: next.harmony ?? undefined })
                    }
                    size={geometry.stage}
                    toneTarget={selectedTone?.accentTarget}
                    value={primaryColor}
                  />,
                )}
              </TabPanel>
            ) : null}
          </Tabs>
          <View height={20} />
          <Divider />
          <ColorHexField
            disabled={interactionPolicy === 'passive'}
            onChange={(color) => emit({ primaryColor: color })}
            value={primaryColor}
          />
        </View>
      ) : null}
    </NativeView>
  );
}

/*** Keeps the settings rail identical while the stage changes presentation. */
function PickerRow({
  children,
  geometry,
  tone,
  tones,
  harmony,
  interactionPolicy,
  onToneChange,
  onHarmonyChange,
}: {
  readonly children: React.ReactNode;
  readonly geometry: ReturnType<typeof resolveColorPickerGeometry>;
  readonly tone?: string;
  readonly tones: readonly ColorToneDefinition[];
  readonly harmony?: ColorHarmony;
  readonly interactionPolicy?: ColorPickerProps['interactionPolicy'];
  readonly onToneChange: (tone: string) => void;
  readonly onHarmonyChange: (harmony?: ColorHarmony) => void;
}) {
  return (
    <View align="flex-start" direction="row" gap={geometry.gap}>
      <View gap="m" width={geometry.rail}>
        <Card compact title="Tone">
          <Select
            interactionPolicy={interactionPolicy}
            onValueChange={onToneChange}
            options={tones.map((entry) => ({ label: entry.accent, value: entry.id }))}
            placeholder="Any tone"
            value={tone}
          />
        </Card>
        <Card compact title="Harmony">
          <Select
            interactionPolicy={interactionPolicy}
            onValueChange={onHarmonyChange}
            options={COLOR_HARMONY_CATALOG.map((entry) => ({
              label: entry.label,
              value: entry.id,
            }))}
            placeholder="None"
            value={harmony}
          />
        </Card>
      </View>
      {children}
    </View>
  );
}

/*** Renders all 64 deterministic OKLCH candidates without scrolling or virtualisation. */
function ColorGrid({
  palette,
  selectionBorderColor,
  selected,
  size,
  onSelect,
  disabled = false,
}: {
  readonly palette: readonly HexColor[];
  readonly selectionBorderColor: string;
  readonly selected: HexColor;
  readonly size: number;
  readonly onSelect: (color: HexColor) => void;
  readonly disabled?: boolean;
}) {
  const gap = Math.max(3, Math.round(size / 68));
  const cell = (size - 7 * gap) / 8;
  return (
    <View accessibilityLabel="Color grid" direction="row" gap={gap} width={size} wrap="wrap">
      {palette.map((color) => (
        <Pressable
          accessibilityLabel={`Select ${color}`}
          bg={color}
          borderColor={color === selected ? selectionBorderColor : 'transparent'}
          borderWidth={color === selected ? 3 : 1}
          disabled={disabled}
          height={cell}
          key={color}
          onPress={() => onSelect(color)}
          radius="s"
          width={cell}
        />
      ))}
    </View>
  );
}

/*** Samples hue, chroma and lightness deterministically into the 8-by-8 grid. */
function resolvePalette(tone?: ColorToneDefinition): readonly HexColor[] {
  const target = tone?.accentTarget;
  return Array.from({ length: 64 }, (_, index) =>
    resolveOklchColor(
      {
        chroma: target?.chroma ?? 0.08 + (index % 8) * 0.018,
        lightness: target?.lightness ?? 0.35 + Math.floor(index / 8) * 0.065,
      },
      (index * 137.508) % 360,
    ),
  );
}

/*** Rejects empty and legacy tab configurations before they render focusable controls. */
function resolveEnabledTabs(tabs: readonly ColorPickerTab[]) {
  if (tabs.length === 0) throw new Error('ColorPicker requires at least one tab.');
  if (tabs.some((tab) => !isColorPickerTab(tab)))
    throw new Error('ColorPicker supports only Grid and Wheel tabs.');
  return tabs;
}

/*** Narrows a Surface tab value to the new ColorPicker vocabulary. */
function isColorPickerTab(value: string): value is ColorPickerTab {
  return value === 'grid' || value === 'wheel';
}
