import { ButtonBase } from '@ankhorage/surface';
import React from 'react';

import { Box, Inline } from '../../foundation';
import { resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Icon } from '../icon';
import { Text } from '../text';
import { resolveChipColors } from './resolveChipColors';
import type { ChipInteractionState, ChipProps } from './types';

function resolveChipPadding(size: NonNullable<ChipProps['size']>): {
  px: 's' | 'm';
  py: 'xxs' | 'xs';
} {
  switch (size) {
    case 's':
      return { px: 's', py: 'xxs' };
    case 'm':
      return { px: 'm', py: 'xs' };
    case 'l':
    default:
      return { px: 'm', py: 'xs' };
  }
}

function ChipInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  children,
  icon,
  selected = false,
  disabled = false,
  color = 'neutral',
  size = 's',
  onPress,
}: ChipProps) {
  const { theme } = useZoraTheme();
  const padding = resolveChipPadding(size);
  const iconSize = resolveIconSize(size);

  const renderContent = (state: ChipInteractionState) => {
    const colors = resolveChipColors({ theme, color, selected, state });
    const textColor = state.disabled
      ? undefined
      : selected && color !== 'neutral'
        ? color
        : undefined;
    const textEmphasis = state.disabled ? 'muted' : 'default';

    return (
      <Box
        bg={colors.backgroundColor}
        borderColor={colors.borderColor}
        borderWidth={1}
        px={padding.px}
        py={padding.py}
        radius="full"
        style={{
          alignSelf: 'flex-start',
          opacity: colors.opacity,
        }}
      >
        <Inline align="center" gap="xs" wrap="nowrap">
          {icon ? (
            <Icon
              color={colors.contentColor}
              name={icon.name}
              provider={icon.provider}
              size={iconSize}
            />
          ) : null}
          <Text color={textColor} emphasis={textEmphasis} variant="label">
            {children}
          </Text>
        </Inline>
      </Box>
    );
  };

  if (!onPress) {
    return renderContent({ disabled, focused: false, hovered: false, pressed: false });
  }

  return (
    <ButtonBase disabled={disabled} onPress={onPress} radius="full" testID={testID}>
      {(state) => renderContent(state)}
    </ButtonBase>
  );
}

/***
 * Compact pill-like control for filters, tags, and quick selections.
 *
 * @readme
 */
export const Chip = withZoraThemeScope(ChipInner);
