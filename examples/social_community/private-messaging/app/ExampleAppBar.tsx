import { AppBar, type AppBarProps, IconButton } from '@ankhorage/zora';
import { useZoraTheme } from '@ankhorage/zora';

type ExampleAppBarChromeProps = Pick<AppBarProps, 'testID' | 'title'>;

export type ExampleAppBarProps = AppBarProps;

export function ExampleAppBar({ testID, title }: ExampleAppBarProps) {
  const { mode, setMode } = useZoraTheme();
  const nextMode = mode === 'dark' ? 'light' : 'dark';

  return (
    <AppBar
      testID={testID}
      title={title}
      actions={
        <IconButton
          icon={{ name: mode === 'dark' ? 'sunny-outline' : 'moon-outline' }}
          label={mode === 'dark' ? 'Use light mode' : 'Use dark mode'}
          emphasis="ghost"
          size="m"
          tone="neutral"
          onPress={() => setMode(nextMode)}
        />
      }
    />
  );
}
