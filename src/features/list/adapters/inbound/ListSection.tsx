import React from 'react';

import type { ListSectionProps } from '../../../../types/list';
import { View } from '../../../layout/public';
import { SectionHeader } from '../../../section/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { List } from './List';

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

/*** Section wrapper for lists with optional ZORA section-heading semantics. */
export const ListSection = withZoraThemeScope(ListSectionInner);
