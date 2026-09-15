import type { ThemeModeToggleProps } from '../../../../types/theme-mode-toggle';
import { IconButton } from '../../../button/public';
import { useZoraTheme } from '../../composition/useZoraTheme';
import { resolveThemeModeToggleState } from '../../utils/resolveThemeModeToggleState';

export function ThemeModeToggle({
  disabled,
  interactionPolicy,
  size = 'm',
  testID,
}: ThemeModeToggleProps) {
  const { mode, setMode } = useZoraTheme();
  const state = resolveThemeModeToggleState(mode);

  return (
    <IconButton
      color="neutral"
      disabled={disabled}
      icon={{ name: state.iconName }}
      interactionPolicy={interactionPolicy}
      label={state.label}
      onPress={() => setMode(state.nextMode)}
      size={size}
      testID={testID}
      variant="ghost"
    />
  );
}
