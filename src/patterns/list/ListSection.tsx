import React from 'react';

import { View } from '../../features/layout/public';
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
    <View gap="s" testID={testID}>
      {hasHeader ? (
        <SectionHeader
          actions={actions}
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
      ) : null}
      <List {...props} />
    </View>
  );
}

/***
 * Section wrapper for lists with optional title and description.
 *
 
 */
export const ListSection = withZoraThemeScope(ListSectionInner);
