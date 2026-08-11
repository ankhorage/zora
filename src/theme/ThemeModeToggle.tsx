import { IconButton } from '../components/icon-button';
import type { ThemeModeToggleProps } from './ThemeModeToggleProps';
import { resolveThemeModeToggleState } from './resolveThemeModeToggleState';
import { useZoraTheme } from './useZoraTheme';

export function ThemeModeToggle({ disabled, size = 'm', testID }: ThemeModeToggleProps) {
  const { mode, setMode } = useZoraTheme();
  const state = resolveThemeModeToggleState(mode);

  return (
    <IconButton
      color="neutral"
      disabled={disabled}
      icon={{ name: state.iconName }}
      label={state.label}
      onPress={() => setMode(state.nextMode)}
      size={size}
      testID={testID}
      variant="ghost"
    />
  );
}
