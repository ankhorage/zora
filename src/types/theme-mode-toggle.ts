import type { IconButtonProps } from '../features/button/public';

export type ThemeModeToggleProps = Pick<
  IconButtonProps,
  'disabled' | 'interactionPolicy' | 'size' | 'testID'
>;
