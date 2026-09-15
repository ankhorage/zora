import { Switch } from '@ankhorage/surface';
import React from 'react';

import { ListItem } from '../../features/list/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
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
    <ListItem
      action={
        <Switch
          checked={value}
          disabled={disabled}
          interactionPolicy={interactionPolicy}
          onCheckedChange={onValueChange}
        />
      }
      description={description}
      disabled={disabled}
      testID={testID}
      title={label}
      variant="card"
    />
  );
}

/***
 * Labeled switch field pattern built on the card-style `ListItem` presentation.
 *
 */
export const SwitchField = withZoraThemeScope(SwitchFieldInner);
