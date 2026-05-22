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

function resolveHorizontalJustify(align: ButtonGroupAlign) {
  switch (align) {
    case 'start':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'between':
      return 'space-between';
    case 'stretch':
    case 'end':
    default:
      return 'flex-end';
  }
}

function resolveVerticalAlign(align: ButtonGroupAlign) {
  switch (align) {
    case 'start':
      return 'flex-start';
    case 'center':
    case 'between':
      return 'center';
    case 'stretch':
      return 'stretch';
    case 'end':
    default:
      return 'flex-end';
  }
}

function resolveStackAlign(align: ButtonGroupAlign, orientation: ButtonGroupOrientation) {
  if (orientation === 'horizontal') {
    return align === 'stretch' ? 'stretch' : 'center';
  }

  if (orientation === 'responsive') {
    return {
      base: resolveVerticalAlign(align),
      md: align === 'stretch' ? 'stretch' : 'center',
    } as const;
  }

  return resolveVerticalAlign(align);
}

function resolveStackJustify(align: ButtonGroupAlign, orientation: ButtonGroupOrientation) {
  if (orientation === 'horizontal') {
    return resolveHorizontalJustify(align);
  }

  if (orientation === 'responsive') {
    return {
      base: align === 'between' ? 'space-between' : 'flex-start',
      md: resolveHorizontalJustify(align),
    } as const;
  }

  return align === 'between' ? 'space-between' : 'flex-start';
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
      align={resolveStackAlign(align, orientation)}
      direction={resolveDirection(orientation)}
      gap={gap}
      justify={resolveStackJustify(align, orientation)}
      testID={testID}
    >
      {orderedItems}
    </Stack>
  );
}

/***
 * Groups multiple `Button` elements with consistent spacing and alignment.
 *
 * @readme
 */
export const ButtonGroup = withZoraThemeScope(ButtonGroupInner);
