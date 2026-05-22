import React from 'react';

import { Card } from '../../components/card';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { PanelProps } from './types';

function PanelInner({ themeId: _themeId, mode: _mode, ...props }: PanelProps) {
  return <Card {...props} />;
}

/***
 * Semantic wrapper around `Card` for panel-style page sections.
 *
 * @readme
 */
export const Panel = withZoraThemeScope(PanelInner);
