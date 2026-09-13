import type { KeyboardAvoidingViewProps as ReactNativeKeyboardAvoidingViewProps } from 'react-native';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export type KeyboardAvoidingViewBehavior = NonNullable<
  ReactNativeKeyboardAvoidingViewProps['behavior']
>;

export interface KeyboardAvoidingViewProps
  extends ZoraBaseProps, Omit<ReactNativeKeyboardAvoidingViewProps, keyof ZoraBaseProps> {}
