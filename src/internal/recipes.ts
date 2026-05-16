import type {
  BadgeProps as SurfaceBadgeProps,
  ButtonProps as SurfaceButtonProps,
  CardProps as SurfaceCardProps,
} from '@ankhorage/surface';
export type { ZoraColor, ZoraEmphasis } from './colorModel';
import type { ZoraColor } from './colorModel';
export type ZoraButtonVariant = NonNullable<SurfaceButtonProps['variant']>;
export type ZoraControlSize = NonNullable<SurfaceButtonProps['size']>;
export type ZoraBadgeVariant = NonNullable<SurfaceBadgeProps['variant']>;
export type ZoraCardTone = 'default' | 'subtle' | 'outline';
export type ZoraContentWidth = 'narrow' | 'default' | 'wide';

export function resolveButtonRecipe({
  color = 'primary',
  variant = 'solid',
  size = 'l',
}: {
  color?: ZoraColor;
  variant?: ZoraButtonVariant;
  size?: ZoraControlSize;
}): Pick<SurfaceButtonProps, 'size' | 'color' | 'variant'> {
  return {
    size,
    color,
    variant,
  };
}

export function resolveBadgeRecipe({
  color = 'primary',
  variant = 'soft',
  size = 'm',
}: {
  color?: ZoraColor;
  variant?: ZoraBadgeVariant;
  size?: ZoraControlSize;
}): Pick<SurfaceBadgeProps, 'size' | 'color' | 'variant'> {
  return {
    size,
    color,
    variant,
  };
}

export function resolveCardVariant(tone: ZoraCardTone = 'default'): SurfaceCardProps['variant'] {
  switch (tone) {
    case 'outline':
      return 'outline';
    case 'subtle':
      return 'subtle';
    case 'default':
    default:
      return 'raised';
  }
}

export function resolveDialogWidth(width: ZoraContentWidth = 'default'): number {
  switch (width) {
    case 'narrow':
      return 420;
    case 'wide':
      return 560;
    case 'default':
    default:
      return 520;
  }
}

export function resolvePageMaxWidth(width: ZoraContentWidth = 'default'): number {
  switch (width) {
    case 'narrow':
      return 760;
    case 'wide':
      return 1280;
    case 'default':
    default:
      return 1040;
  }
}

export function resolveIconSize(size: ZoraControlSize = 'l'): number {
  switch (size) {
    case 's':
      return 16;
    case 'm':
      return 18;
    case 'l':
    default:
      return 20;
  }
}
