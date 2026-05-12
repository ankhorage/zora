import type React from 'react';
import type { ImageSourcePropType } from 'react-native';

import type { AvatarShape, AvatarSize } from '../../components/avatar';
import type { ZoraTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type MessageBubbleDirection = 'incoming' | 'outgoing' | 'system';
export type MessageBubbleStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageBubbleAvatar {
  source?: ImageSourcePropType;
  name?: string;
  initials?: string;
  label?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  tone?: ZoraTone;
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
  status?: MessageBubbleStatus | React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  footer?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  compact?: boolean;
  accessibilityLabel?: string;
  onPress?: () => void;
}
