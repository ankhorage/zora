import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraColor, ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ChipGroupItem<TValue extends string = string> {
  value: TValue;
  label: React.ReactNode;
  icon?: ButtonIconSpec;
  disabled?: boolean;
  testID?: string;
}

interface ChipGroupBaseProps<TValue extends string> extends ZoraBaseProps {
  items: readonly ChipGroupItem<TValue>[];
  color?: ZoraColor;
  size?: ZoraControlSize;
  wrap?: boolean;
  disabled?: boolean;
}

interface ChipGroupSingleProps<TValue extends string> {
  multiple?: false;
  value: TValue;
  onValueChange: (value: TValue) => void;
}

interface ChipGroupMultipleProps<TValue extends string> {
  multiple: true;
  value: readonly TValue[];
  onValueChange: (value: TValue[]) => void;
}

export type ChipGroupProps<TValue extends string = string> = ChipGroupBaseProps<TValue> &
  (ChipGroupSingleProps<TValue> | ChipGroupMultipleProps<TValue>);
