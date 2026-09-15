import {
  PopoverMenu as SurfacePopoverMenu,
  type PopoverMenuAction as SurfacePopoverMenuAction,
} from '@ankhorage/surface';
import React from 'react';

import type { PopoverMenuAction, PopoverMenuProps } from '../../../../types/popover-menu';
import { Icon } from '../../../icon/public';
import { resolveIconSize } from '../../../icon/utils/resolveIconSize';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';

/*** Presents a ZORA-styled action list through the Surface PopoverMenu capability. */
export const PopoverMenu = withZoraThemeScope(PopoverMenuInner);

/*** Maps ZORA action presentation into the Surface action-menu boundary. */
function PopoverMenuInner({
  themeId: _themeId,
  mode: _mode,
  actions,
  onDismiss,
  ...props
}: PopoverMenuProps) {
  const { theme } = useZoraTheme();
  const iconColor = theme.semantics.content.muted;
  const surfaceActions = React.useMemo(
    () => actions.map((action) => toSurfaceAction(action, iconColor)),
    [actions, iconColor],
  );

  return <SurfacePopoverMenu {...props} actions={surfaceActions} dismiss={onDismiss} />;
}

/*** Maps one ZORA PopoverMenu action to the Surface action contract. */
function toSurfaceAction(action: PopoverMenuAction, iconColor: string): SurfacePopoverMenuAction {
  return {
    activate: action.onPress,
    description: action.description,
    disabled: action.disabled,
    id: action.id,
    intent: action.intent,
    leading: renderActionLeading(action, iconColor),
    selected: action.selected,
    title: action.title,
    trailing: renderActionTrailing(action),
  };
}

/*** Resolves explicit leading content or the configured action icon. */
function renderActionLeading(action: PopoverMenuAction, iconColor: string): React.ReactNode {
  if (action.leading !== undefined) return action.leading;
  if (action.icon === undefined) return undefined;
  return <Icon {...action.icon} color={iconColor} size={resolveIconSize('s')} />;
}

/*** Wraps optional trailing action content in the ZORA layout boundary. */
function renderActionTrailing(action: PopoverMenuAction): React.ReactNode {
  return action.trailing === undefined ? undefined : <View>{action.trailing}</View>;
}
