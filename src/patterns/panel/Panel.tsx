import React from 'react';

import { Card } from '../../components/card';
import type { PanelProps } from './types';

export function Panel(props: PanelProps) {
  return <Card {...props} />;
}
