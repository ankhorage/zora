import type React from 'react';

export interface SettingsRowProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  control?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}
