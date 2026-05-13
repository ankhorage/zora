import { AppBar, type AppBarProps, IconButton, Inline, useZoraTheme } from '@ankhorage/zora';

export type ExampleAppBarProps = AppBarProps;

export function ExampleAppBar({ actions, ...props }: ExampleAppBarProps) {
  const { mode, setMode } = useZoraTheme();
  const nextMode = mode === 'dark' ? 'light' : 'dark';

  return (
    <AppBar
      {...props}
      actions={
        <Inline align="center" gap="s" wrap="nowrap">
          {actions}
          <IconButton
            icon={{ name: mode === 'dark' ? 'sunny-outline' : 'moon-outline' }}
            label={mode === 'dark' ? 'Use light mode' : 'Use dark mode'}
            emphasis="ghost"
            size="m"
            tone="neutral"
            onPress={() => setMode(nextMode)}
          />
        </Inline>
      }
    />
  );
}
