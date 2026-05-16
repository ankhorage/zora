import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';
import type { ImageSourcePropType } from 'react-native';

import type { AvatarShape, AvatarSize } from '../../components/avatar';
import type { ZoraCardTone, ZoraColor } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface PostAuthorAvatar {
  source?: ImageSourcePropType;
  name?: string;
  initials?: string;
  label?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  color?: ZoraColor;
}

export interface PostAuthor {
  name: React.ReactNode;
  subtitle?: React.ReactNode;
  avatar?: PostAuthorAvatar;
}

interface PostCardSourceMedia {
  source: ImageSourcePropType;
  label: string;
  aspectRatio?: number;
  children?: never;
}

interface PostCardCustomMedia {
  children: React.ReactNode;
  label?: string;
  aspectRatio?: number;
  source?: never;
}

export type PostCardMedia = PostCardSourceMedia | PostCardCustomMedia;

export interface PostAction {
  id: string;
  label: string;
  icon?: ButtonIconSpec;
  count?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export interface PostCommentPreview {
  id: string;
  author?: PostAuthor;
  text: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
}

export interface PostCardProps extends ZoraBaseProps {
  author: PostAuthor;
  text?: React.ReactNode;
  children?: React.ReactNode;
  media?: PostCardMedia | readonly PostCardMedia[];
  actions?: readonly PostAction[];
  comments?: readonly PostCommentPreview[];
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: ZoraCardTone;
  compact?: boolean;
  onPress?: () => void;
}
