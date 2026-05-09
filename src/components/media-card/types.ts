import type React from 'react';
import type { ImageSourcePropType } from 'react-native';

import type { ZoraCardTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

interface MediaCardWithImageSource {
  imageSource: ImageSourcePropType;
  imageLabel?: string;
  image?: never;
}

interface MediaCardWithImageSlot {
  image: React.ReactNode;
  imageSource?: never;
  imageLabel?: never;
}

interface MediaCardWithoutImage {
  image?: never;
  imageSource?: never;
  imageLabel?: never;
}

export type MediaCardImageProps =
  | MediaCardWithImageSource
  | MediaCardWithImageSlot
  | MediaCardWithoutImage;

interface MediaCardBaseProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  tone?: ZoraCardTone;
  compact?: boolean;
  onPress?: () => void;
  imageAspectRatio?: number;
}

export type MediaCardProps = MediaCardBaseProps & MediaCardImageProps;
