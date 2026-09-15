import React from 'react';

import type { OAuthProviderButtonProps } from '../../../../types/auth';
import { Button } from '../../../button/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { resolveOAuthProviderIcon, resolveOAuthProviderLabel } from '../../utils/oauthProviders';

function OAuthProviderButtonInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  providerId,
  label,
  icon,
  disabled = false,
  loading = false,
  fullWidth = true,
  size = 'l',
  variant = 'outline',
  color = 'neutral',
  onPress,
  testID,
}: OAuthProviderButtonProps) {
  const resolvedIcon = icon ?? resolveOAuthProviderIcon(providerId);
  const resolvedLabel = label ?? `Continue with ${resolveOAuthProviderLabel(providerId)}`;

  return (
    <Button
      color={color}
      disabled={disabled || loading || onPress === undefined}
      fullWidth={fullWidth}
      interactionPolicy={interactionPolicy}
      leadingIcon={resolvedIcon}
      loading={loading}
      onPress={() => {
        void onPress?.(providerId);
      }}
      size={size}
      testID={testID}
      variant={variant}
    >
      {resolvedLabel}
    </Button>
  );
}

/***
 * Renders a provider-branded OAuth action button without owning auth behavior.
 *
 * The component only renders UI and forwards the provider id through `onPress`.
 * Adapters, redirects, and callback handling belong to app/runtime layers.
 */
export const OAuthProviderButton = withZoraThemeScope(OAuthProviderButtonInner);
