import React from 'react';

import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { OAuthProviderButton } from './OAuthProviderButton';
import type { OAuthProviderListProps } from './types';

function OAuthProviderListInner({
  themeId: _themeId,
  mode: _mode,
  providers,
  disabled = false,
  loading = false,
  fullWidth,
  layout = 'stack',
  size,
  variant,
  color,
  onProviderPress,
  testID,
}: OAuthProviderListProps) {
  const direction = layout === 'inline' ? 'row' : 'column';
  const resolvedFullWidth = fullWidth ?? layout === 'stack';

  return (
    <Stack
      direction={direction}
      gap="s"
      testID={testID}
      wrap={layout === 'inline' ? 'wrap' : undefined}
    >
      {providers.map((provider) => (
        <OAuthProviderButton
          color={color}
          disabled={disabled || provider.disabled}
          fullWidth={resolvedFullWidth}
          icon={provider.icon}
          key={provider.id}
          label={provider.label}
          loading={loading || provider.loading}
          onPress={onProviderPress}
          providerId={provider.id}
          size={size}
          variant={variant}
        />
      ))}
    </Stack>
  );
}

/***
 * Renders a group of OAuth provider buttons for sign-in and auth settings flows.
 */
export const OAuthProviderList = withZoraThemeScope(OAuthProviderListInner);
