import type {
  BadgeProps as SurfaceBadgeProps,
  ButtonProps as SurfaceButtonProps,
  CardProps as SurfaceCardProps,
} from '@ankhorage/surface';

export type ZoraTone = NonNullable<SurfaceButtonProps['tone']>;
export type ZoraEmphasis = NonNullable<SurfaceButtonProps['variant']>;
export type ZoraControlSize = NonNullable<SurfaceButtonProps['size']>;
export type ZoraBadgeEmphasis = NonNullable<SurfaceBadgeProps['variant']>;
export type ZoraCardTone = 'default' | 'subtle' | 'outline';
export type ZoraContentWidth = 'narrow' | 'default' | 'wide';

export function resolveButtonRecipe({
  tone = 'primary',
  emphasis = 'solid',
  size = 'l',
}: {
  tone?: ZoraTone;
  emphasis?: ZoraEmphasis;
  size?: ZoraControlSize;
}): Pick<SurfaceButtonProps, 'size' | 'tone' | 'variant'> {
  return {
    size,
    tone,
    variant: emphasis,
  };
}

export function resolveBadgeRecipe({
  tone = 'primary',
  emphasis = 'soft',
  size = 'm',
}: {
  tone?: ZoraTone;
  emphasis?: ZoraBadgeEmphasis;
  size?: ZoraControlSize;
}): Pick<SurfaceBadgeProps, 'size' | 'tone' | 'variant'> {
  return {
    size,
    tone,
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
