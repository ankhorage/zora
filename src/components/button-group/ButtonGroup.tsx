import React from 'react';

import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ButtonGroupAlign, ButtonGroupOrientation, ButtonGroupProps } from './types';

function resolveDirection(orientation: ButtonGroupOrientation) {
  if (orientation === 'vertical') {
    return 'column';
  }

  if (orientation === 'responsive') {
    return { base: 'column', md: 'row' } as const;
  }

  return 'row';
}

function resolveAlign(align: ButtonGroupAlign) {
  switch (align) {
    case 'end':
      return 'flex-end';
    case 'start':
      return 'flex-start';
    case 'stretch':
      return 'stretch';
    case 'between':
    case 'center':
    default:
      return 'center';
  }
}

function resolveJustify(align: ButtonGroupAlign) {
  return align === 'between' ? 'space-between' : undefined;
}

function ButtonGroupInner({
  themeId: _themeId,
  mode: _mode,
  children,
  align = 'end',
  orientation = 'horizontal',
  gap = 's',
  reverse = false,
  testID,
}: ButtonGroupProps) {
  const items = React.Children.toArray(children);
  const orderedItems = reverse ? items.reverse() : items;

  return (
    <Stack
      align={resolveAlign(align)}
      direction={resolveDirection(orientation)}
      gap={gap}
      justify={resolveJustify(align)}
      testID={testID}
    >
      {orderedItems}
    </Stack>
  );
}

export const ButtonGroup = withZoraThemeScope(ButtonGroupInner);
