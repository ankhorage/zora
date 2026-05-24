import React from 'react';

import { Box, Center, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Heading } from '../heading';
import { Text } from '../text';
import type { SplashScreenLogoShape, SplashScreenProps } from './types';

function resolveLogoRadius(shape: SplashScreenLogoShape): NonNullable<SplashScreenProps['logoSize']> {
  switch (shape) {
    case 'circle':
      return 9999;
    case 'square':
      return 0;
    case 'rounded':
    default:
      return 28;
  }
}

function PlaceholderLogo({
  label,
  shape,
  size,
}: Required<Pick<SplashScreenProps, 'logoLabel' | 'logoShape' | 'logoSize'>>) {
  const { theme } = useZoraTheme();
  const radius = resolveLogoRadius(shape);

  return (
    <Center
      accessibilityLabel={label}
      bg={theme.semantics.action.primary.base}
      height={size}
      radius="xl"
      width={size}
      style={{ borderRadius: radius }}
    >
      <Text emphasis="inverse" variant="eyebrow" weight="bold">
        {label.slice(0, 2).toUpperCase()}
      </Text>
    </Center>
  );
}

function SplashScreenInner({
  themeId: _themeId,
  mode: _mode,
  logo,
  title,
  subtitle,
  children,
  minHeight = '100%',
  backgroundColor,
  logoSize = 96,
  logoLabel = 'ZORA',
  logoShape = 'rounded',
  testID,
}: SplashScreenProps) {
  const { theme } = useZoraTheme();
  const background = backgroundColor ?? theme.semantics.neutral.surface;
  const renderedLogo = logo ?? (
    <PlaceholderLogo label={logoLabel} shape={logoShape} size={logoSize} />
  );

  return (
    <Center bg={background} minHeight={minHeight} p="xl" testID={testID} width="100%">
      <Stack align="center" gap="l" style={{ maxWidth: 360 }}>
        {renderedLogo}
        {title || subtitle ? (
          <Stack align="center" gap="xs">
            {title ? (
              <Heading align="center" level={1} size="l">
                {title}
              </Heading>
            ) : null}
            {subtitle ? (
              <Text align="center" emphasis="muted" variant="bodySmall">
                {subtitle}
              </Text>
            ) : null}
          </Stack>
        ) : null}
        {children ? <Box width="100%">{children}</Box> : null}
      </Stack>
    </Center>
  );
}

/***
 * Branded launch/loading surface for previews, web fallbacks, and app bootstrap states.
 *
 * `SplashScreen` is a React-rendered component. It intentionally does not manage
 * Expo's native splash screen lifecycle or replace generated `expo-splash-screen`
 * configuration.
 */
export const SplashScreen = withZoraThemeScope(SplashScreenInner);
