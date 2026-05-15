import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { SectionHeader } from '../section-header';
import { List } from './List';
import type { ListSectionProps } from './types';

function ListSectionInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  title,
  description,
  eyebrow,
  actions,
  ...props
}: ListSectionProps) {
  const hasHeader = title !== undefined;

  return (
    <Stack gap="s" testID={testID} style={{ minWidth: 0, width: '100%' }}>
      {hasHeader ? (
        <Box style={{ minWidth: 0, width: '100%' }}>
          <SectionHeader
            actions={actions}
            description={description}
            eyebrow={eyebrow}
            title={title}
          />
        </Box>
      ) : null}
      <Box style={{ minWidth: 0, width: '100%' }}>
        <List {...props} />
      </Box>
    </Stack>
  );
}

export const ListSection = withZoraThemeScope(ListSectionInner);
