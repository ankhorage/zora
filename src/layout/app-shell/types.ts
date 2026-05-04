import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface AppShellProps extends ZoraBaseProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  overlay?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
}
