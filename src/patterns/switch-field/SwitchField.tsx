import { Switch } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { SettingsRow } from '../settings-row';
import type { SwitchFieldProps } from './types';

function SwitchFieldInner({
  themeId: _themeId,
  mode: _mode,
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

export const SwitchField = withZoraThemeScope(SwitchFieldInner);
