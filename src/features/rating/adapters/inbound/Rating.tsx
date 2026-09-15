import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';

import type { RatingProps } from '../../../../types/rating';
import type { ZoraColor } from '../../../../types/theme';
import { Icon } from '../../../icon/public';
import { resolveIconSize } from '../../../icon/utils/resolveIconSize';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { resolveRatingSegments } from '../../utils/resolveRatingSegments';

/*** Displays a read-only star rating with optional half steps. */
export const Rating = withZoraThemeScope(RatingInner);

/*** Resolves rating visuals from the active ZORA theme. */
function RatingInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  testID,
  value,
  max = 5,
  color = 'warning',
  size = 'm',
}: RatingProps) {
  const { theme } = useZoraTheme();
  const role = resolveRatingRole(theme, color);
  const segments = resolveRatingSegments({ value, max });
  const iconSize = resolveIconSize(size);

  return (
    <View direction="row" align="center" gap="xxs" testID={testID} wrap="nowrap">
      {segments.map((segment, index) => {
        const name =
          segment === 'full' ? 'star' : segment === 'half' ? 'star-half' : 'star-outline';
        const segmentColor = segment === 'empty' ? theme.semantics.content.muted : role.base;
        return (
          <Icon key={`${index}-${segment}`} color={segmentColor} name={name} size={iconSize} />
        );
      })}
    </View>
  );
}

/*** Resolves the semantic theme role for a ZORA rating color. */
function resolveRatingRole(theme: SurfaceTheme, color: ZoraColor): RoleSemantics {
  switch (color) {
    case 'secondary':
      return theme.semantics.secondary;
    case 'tertiary':
      return theme.semantics.accent;
    case 'quaternary':
      return theme.semantics.highlight;
    case 'error':
      return theme.semantics.error;
    case 'info':
      return theme.semantics.info;
    case 'primary':
      return theme.semantics.action.primary;
    case 'danger':
      return theme.semantics.action.danger;
    case 'success':
      return theme.semantics.success;
    case 'warning':
      return theme.semantics.warning;
    case 'neutral':
    default:
      return theme.semantics.action.neutral;
  }
}
