import type { ZoraBaseProps } from './base';
import type { IconButtonProps } from './icon-button';

export type ThemeModeToggleProps = ZoraBaseProps &
  Pick<IconButtonProps, 'disabled' | 'interactionPolicy' | 'size' | 'testID'>;
