import React from 'react';

import { Card } from '../../components/card';
import { resolveCardThemeRecipe } from '../../components/card/resolveCardThemeRecipe';
import { useZoraThemeRecipe } from '../../theme/useZoraThemeRecipe';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { PanelProps } from './types';

function PanelInner({
  themeId: _themeId,
  mode: _mode,
  tone,
  compact,
  padding,
  radius,
  ...props
}: PanelProps) {
  const themeFields = useZoraThemeRecipe('Panel');
  const recipe = resolveCardThemeRecipe({ tone, compact, padding, radius, themeFields });
  return <Card {...props} {...recipe} />;
}

/***
 * Semantic wrapper around `Card` for panel-style page sections.
 */
export const Panel = withZoraThemeScope(PanelInner);
