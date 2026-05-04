import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

interface SettingsRowBaseProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  disabled?: boolean;
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
