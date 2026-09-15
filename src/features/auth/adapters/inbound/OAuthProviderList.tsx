import React from 'react';

import type { OAuthProviderListProps } from '../../../../types/auth';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { OAuthProviderButton } from './OAuthProviderButton';

function OAuthProviderListInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
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
    <View
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
          interactionPolicy={interactionPolicy}
        />
      ))}
    </View>
  );
}

/***
 * Renders a group of OAuth provider buttons for sign-in and auth settings flows.
 */
export const OAuthProviderList = withZoraThemeScope(OAuthProviderListInner);
