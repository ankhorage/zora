import type {
  BadgeProps as SurfaceBadgeProps,
  ButtonProps as SurfaceButtonProps,
  CardProps as SurfaceCardProps,
} from '@ankhorage/surface';

export type ZoraPaletteColor = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'neutral';
export type ZoraStatusColor = 'success' | 'warning' | 'error' | 'info';
export type ZoraColor = ZoraPaletteColor | ZoraStatusColor | 'danger';
export type ZoraEmphasis = NonNullable<SurfaceButtonProps['variant']>;
export type ZoraControlSize = NonNullable<SurfaceButtonProps['size']>;
export type ZoraBadgeEmphasis = NonNullable<SurfaceBadgeProps['variant']>;
export type ZoraCardTone = 'default' | 'subtle' | 'outline';
export type ZoraContentWidth = 'narrow' | 'default' | 'wide';

type SurfaceComponentTone = NonNullable<SurfaceButtonProps['tone']>;

export function resolveZoraColorToSurfaceTone(color: ZoraColor): SurfaceComponentTone {
  switch (color) {
    case 'primary':
      return 'primary';
    case 'danger':
    case 'error':
      return 'danger';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'secondary':
    case 'tertiary':
    case 'quaternary':
    case 'neutral':
    case 'info':
    default:
      return 'neutral';
  }
}

export function resolveButtonRecipe({
  color = 'primary',
  emphasis = 'solid',
  size = 'l',
}: {
  color?: ZoraColor;
  emphasis?: ZoraEmphasis;
  size?: ZoraControlSize;
}): Pick<SurfaceButtonProps, 'size' | 'tone' | 'variant'> {
  return {
    size,
    tone: resolveZoraColorToSurfaceTone(color),
    variant: emphasis,
  };
}

export function resolveBadgeRecipe({
  color = 'primary',
  emphasis = 'soft',
  size = 'm',
}: {
  color?: ZoraColor;
  emphasis?: ZoraBadgeEmphasis;
  size?: ZoraControlSize;
}): Pick<SurfaceBadgeProps, 'size' | 'tone' | 'variant'> {
  return {
    size,
    tone: resolveZoraColorToSurfaceTone(color),
    variant: emphasis,
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
