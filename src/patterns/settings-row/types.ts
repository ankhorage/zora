import type React from 'react';

interface SettingsRowBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

interface SettingsRowPressableProps {
  onPress: () => void;
  control?: never;
}

interface SettingsRowControlledProps {
  control: React.ReactNode;
  onPress?: never;
}

interface SettingsRowStaticProps {
  control?: never;
  onPress?: never;
}

export type SettingsRowProps = SettingsRowBaseProps &
  (SettingsRowPressableProps | SettingsRowControlledProps | SettingsRowStaticProps);
