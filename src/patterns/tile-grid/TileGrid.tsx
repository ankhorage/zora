import { Box } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { TileGridProps } from './types';

function TileGridInner({
  themeId: _themeId,
  mode: _mode,
  children,
  columns = 'responsive',
  compact = false,
  testID,
}: TileGridProps) {
  return (
    <Box
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
          <Box
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
          </Box>
        );
      })}
    </Box>
  );
}

export const TileGrid = withZoraThemeScope(TileGridInner);
