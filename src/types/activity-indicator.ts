import type { ActivityIndicatorProps as ReactNativeActivityIndicatorProps } from 'react-native';

import type { ZoraBaseProps } from './base';

export interface ActivityIndicatorProps
  extends ZoraBaseProps, Omit<ReactNativeActivityIndicatorProps, 'color'> {
  color?: ReactNativeActivityIndicatorProps['color'];
}
