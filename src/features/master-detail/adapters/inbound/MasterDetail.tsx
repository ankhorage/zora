import { useBreakpoint } from '@ankhorage/surface';
import React from 'react';

import type { MasterDetailProps } from '../../../../types/master-detail';
import { ScrollView, View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { resolveMasterDetailPresentation } from '../../application/resolveMasterDetailPresentation';

/** Renders responsive master and detail panes while leaving route transitions to Navigator. */
export const MasterDetail = withZoraThemeScope(MasterDetailInner);

/** Projects the same two manifest slots into a desktop split or one compact route pane. */
function MasterDetailInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  activePane = 'master',
  desktopMode = 'split',
  detail,
  master,
  masterWidth = 30,
  testID,
}: MasterDetailProps) {
  const presentation = resolveMasterDetailPresentation(useBreakpoint(), activePane, desktopMode);
  const masterPane = <MasterPane master={master} testID={testID} />;
  const detailPane = <DetailPane detail={detail} testID={testID} />;

  if (presentation === 'master') return masterPane;
  if (presentation === 'detail') return detailPane;

  return (
    <View direction="row" flex={1} minHeight={0} minWidth={0} testID={testID}>
      <View flex={masterWidth} minHeight={0} minWidth={0}>
        {masterPane}
      </View>
      <View flex={100 - masterWidth} minHeight={0} minWidth={0}>
        {detailPane}
      </View>
    </View>
  );
}

/** Provides the independently bounded master-list scroll region. */
function MasterPane({ master, testID }: Pick<MasterDetailProps, 'master' | 'testID'>) {
  return (
    <ScrollView
      flex={1}
      minHeight={0}
      minWidth={0}
      testID={testID ? `${testID}-master` : undefined}
    >
      {master}
    </ScrollView>
  );
}

/** Provides the independently bounded detail scroll region. */
function DetailPane({ detail, testID }: Pick<MasterDetailProps, 'detail' | 'testID'>) {
  return (
    <ScrollView
      flex={1}
      minHeight={0}
      minWidth={0}
      testID={testID ? `${testID}-detail` : undefined}
    >
      {detail}
    </ScrollView>
  );
}
