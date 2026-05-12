import type React from 'react';
import type { ImageSourcePropType } from 'react-native';

import type { AvatarShape, AvatarSize } from '../../components/avatar';
import type { ZoraTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ChatListAvatar {
  source?: ImageSourcePropType;
  name?: string;
  initials?: string;
  label?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  tone?: ZoraTone;
}

export interface ChatListItemProps extends ZoraBaseProps {
  title: React.ReactNode;
  preview?: React.ReactNode;
  meta?: React.ReactNode;
  timestamp?: React.ReactNode;
  avatar?: ChatListAvatar;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  unread?: boolean;
  unreadCount?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  compact?: boolean;
  accessibilityLabel?: string;
  onPress?: () => void;
}
