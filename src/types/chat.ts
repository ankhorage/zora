import type React from 'react';
import type { ImageSourcePropType } from 'react-native';

import type { AvatarShape, AvatarSize } from '../features/avatar/public';
import type { ZoraBaseProps } from './base';
import type { ZoraColor } from './theme';

export interface ChatListAvatar {
  source?: ImageSourcePropType;
  name?: string;
  initials?: string;
  label?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  color?: ZoraColor;
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

export type MessageBubbleDirection = 'incoming' | 'outgoing' | 'system';
export type MessageBubbleStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
type MessageBubbleStatusContent = MessageBubbleStatus | Exclude<React.ReactNode, string>;

export interface MessageBubbleAvatar {
  source?: ImageSourcePropType;
  name?: string;
  initials?: string;
  label?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  color?: ZoraColor;
}

export interface MessageBubbleAuthor {
  name?: React.ReactNode;
  avatar?: MessageBubbleAvatar;
}

export interface MessageBubbleProps extends ZoraBaseProps {
  direction?: MessageBubbleDirection;
  text?: React.ReactNode;
  children?: React.ReactNode;
  author?: MessageBubbleAuthor;
  timestamp?: React.ReactNode;
  meta?: React.ReactNode;
  status?: MessageBubbleStatusContent;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  footer?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  compact?: boolean;
  accessibilityLabel?: string;
  onPress?: () => void;
}
