import type { IconButtonProps } from './icon-button';

export type ThemeModeToggleProps = Pick<
  IconButtonProps,
  'disabled' | 'interactionPolicy' | 'size' | 'testID'
>;
