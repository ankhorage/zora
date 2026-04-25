import { Switch } from '@ankhorage/surface';
import React from 'react';

import { SettingsRow } from '../settings-row';
import type { SwitchFieldProps } from './types';

export function SwitchField({
  label,
  description,
  value,
  onValueChange,
  disabled,
  testID,
}: SwitchFieldProps) {
  return (
    <SettingsRow
      title={label}
      description={description}
      disabled={disabled}
      testID={testID}
      control={<Switch checked={value} onCheckedChange={onValueChange} disabled={disabled} />}
    />
  );
}
