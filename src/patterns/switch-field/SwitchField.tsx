import { Switch } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { ListRow } from '../list';
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
  interactionPolicy,
}: SwitchFieldProps) {
  return (
    <ListRow
      title={label}
      description={description}
      disabled={disabled}
      testID={testID}
      action={
        <Switch
          checked={value}
          disabled={disabled}
          interactionPolicy={interactionPolicy}
          onCheckedChange={onValueChange}
        />
      }
    />
  );
}

/***
 * Labeled switch field pattern built on `ListRow`.
 *
 
 */
export const SwitchField = withZoraThemeScope(SwitchFieldInner);
