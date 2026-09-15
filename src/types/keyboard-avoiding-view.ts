import type { KeyboardAvoidingViewProps as SurfaceKeyboardAvoidingViewProps } from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';

export type KeyboardAvoidingViewBehavior = NonNullable<
  SurfaceKeyboardAvoidingViewProps['behavior']
>;

export interface KeyboardAvoidingViewProps
  extends ZoraBaseProps, Omit<SurfaceKeyboardAvoidingViewProps, keyof ZoraBaseProps> {}
