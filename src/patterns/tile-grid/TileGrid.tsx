import React from 'react';

import { View } from '../../features/layout/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { TileGridProps } from './types';

function TileGridInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  children,
  columns = 'responsive',
  compact = false,
  testID,
}: TileGridProps) {
  return (
    <View
      testID={testID}
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: compact ? 8 : 16,
      }}
    >
      {React.Children.map(children, (child) => {
        if (!child) return null;

        return (
          <View
            style={
              columns === 'responsive'
                ? {
                    flexBasis: '30%',
                    flexGrow: 1,
                    minWidth: 120,
                  }
                : {
                    width: `${100 / columns}%`,
                  }
            }
          >
            {child}
          </View>
        );
      })}
    </View>
  );
}

/***
 * Responsive grid layout for arranging tile content.
 *
 
 */
export const TileGrid = withZoraThemeScope(TileGridInner);
