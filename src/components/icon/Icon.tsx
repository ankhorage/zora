import { Icon as SurfaceIcon, type IconProps as SurfaceIconProps } from '@ankhorage/surface';
import React from 'react';

export type IconProps = SurfaceIconProps;

export function Icon(props: IconProps) {
  return <SurfaceIcon {...props} />;
}
