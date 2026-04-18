import type React from 'react';

import type { ZoraTone } from '../../internal/recipes';

export interface NoticeProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  tone?: ZoraTone;
  testID?: string;
}
