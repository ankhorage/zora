import { appBarMeta } from '../components/app-bar/meta';
import { avatarMeta } from '../components/avatar/meta';
import { avatarGroupMeta } from '../components/avatar-group/meta';
import { badgeMeta } from '../components/badge/meta';
import { buttonMeta } from '../components/button/meta';
import { cardMeta } from '../components/card/meta';
import { checkboxGroupMeta, checkboxMeta } from '../components/checkbox/meta';
import { chipMeta } from '../components/chip/meta';
import { chipGroupMeta } from '../components/chip-group/meta';
import { drawerMeta } from '../components/drawer/meta';
import { formActionsMeta, formErrorMeta, formFieldMeta, formMeta } from '../components/form/meta';
import { headingMeta } from '../components/heading/meta';
import { iconMeta } from '../components/icon/meta';
import { iconButtonMeta } from '../components/icon-button/meta';
import { imageMeta } from '../components/image/meta';
import { inputMeta } from '../components/input/meta';
import { mediaCardMeta } from '../components/media-card/meta';
import { metricCardMeta } from '../components/metric-card/meta';
import { modalMeta } from '../components/modal/meta';
import { navigationItemMeta } from '../components/navigation-item/meta';
import { navigationListMeta } from '../components/navigation-list/meta';
import { progressMeta } from '../components/progress/meta';
import { radioGroupMeta, radioMeta } from '../components/radio/meta';
import { ratingMeta } from '../components/rating/meta';
import { searchBarMeta } from '../components/search-bar/meta';
import { selectMeta } from '../components/select/meta';
import { tabsMeta } from '../components/tabs/meta';
import { textMeta } from '../components/text/meta';
import { textareaMeta } from '../components/textarea/meta';
import { toolbarActionMeta, toolbarMeta } from '../components/toolbar/meta';
import { foundationMetas } from '../foundation/meta';
import { appShellMeta } from '../layout/app-shell/meta';
import { authLayoutMeta } from '../layout/auth-layout/meta';
import { pageMeta } from '../layout/page/meta';
import { pageHeaderMeta } from '../layout/page-header/meta';
import { pageSectionMeta } from '../layout/page-section/meta';
import { settingsLayoutMeta } from '../layout/settings-layout/meta';
import { sidebarLayoutMeta } from '../layout/sidebar-layout/meta';
import { topbarLayoutMeta } from '../layout/topbar-layout/meta';
import {
  forgotPasswordFormMeta,
  otpFormMeta,
  signInFormMeta,
  signUpFormMeta,
} from '../patterns/auth/meta';
import { collectionEditorMeta } from '../patterns/collection-editor/meta';
import { confirmDialogMeta } from '../patterns/confirm-dialog/meta';
import { disclosureSectionMeta } from '../patterns/disclosure-section/meta';
import { emptyStateMeta } from '../patterns/empty-state/meta';
import { filterBarMeta } from '../patterns/filter-bar/meta';
import { heroMeta } from '../patterns/hero/meta';
import { imagePreviewMeta } from '../patterns/image-preview/meta';
import { imageUploadFieldMeta } from '../patterns/image-upload-field/meta';
import { inspectorFieldMeta } from '../patterns/inspector-field/meta';
import { listMeta, listRowMeta, listSectionMeta } from '../patterns/list/meta';
import { noticeMeta } from '../patterns/notice/meta';
import { panelMeta } from '../patterns/panel/meta';
import { responsivePanelMeta } from '../patterns/responsive-panel/meta';
import { sectionHeaderMeta } from '../patterns/section-header/meta';
import { selectableItemMeta, selectionProviderMeta } from '../patterns/selection/meta';
import { settingsRowMeta } from '../patterns/settings-row/meta';
import { switchFieldMeta } from '../patterns/switch-field/meta';
import { themeComposerMeta } from '../patterns/theme-composer/meta';
import { paletteItemMeta, tileGridMeta } from '../patterns/tile-grid/meta';
import { timelineMeta } from '../patterns/timeline/meta';
import { treeItemMeta, treeViewMeta } from '../patterns/tree-view/meta';
import { zoraDrawerContentMeta } from '../patterns/zora-drawer-content/meta';
import { zoraTabBarMeta } from '../patterns/zora-tab-bar/meta';
import type { ZoraComponentMetaRegistry } from './types';

export const ZORA_COMPONENT_META: ZoraComponentMetaRegistry = {
  ...foundationMetas,
  AppBar: appBarMeta,
  Avatar: avatarMeta,
  AvatarGroup: avatarGroupMeta,
  Badge: badgeMeta,
  Button: buttonMeta,
  Card: cardMeta,
  Checkbox: checkboxMeta,
  CheckboxGroup: checkboxGroupMeta,
  Chip: chipMeta,
  ChipGroup: chipGroupMeta,
  Drawer: drawerMeta,
  Form: formMeta,
  FormActions: formActionsMeta,
  FormError: formErrorMeta,
  FormField: formFieldMeta,
  Heading: headingMeta,
  Icon: iconMeta,
  IconButton: iconButtonMeta,
  Image: imageMeta,
  Input: inputMeta,
  MediaCard: mediaCardMeta,
  MetricCard: metricCardMeta,
  Modal: modalMeta,
  NavigationItem: navigationItemMeta,
  NavigationList: navigationListMeta,
  Progress: progressMeta,
  Radio: radioMeta,
  RadioGroup: radioGroupMeta,
  Rating: ratingMeta,
  SearchBar: searchBarMeta,
  Select: selectMeta,
  Tabs: tabsMeta,
  Text: textMeta,
  Textarea: textareaMeta,
  Toolbar: toolbarMeta,
  ToolbarAction: toolbarActionMeta,
  AppShell: appShellMeta,
  AuthLayout: authLayoutMeta,
  Page: pageMeta,
  PageHeader: pageHeaderMeta,
  PageSection: pageSectionMeta,
  SettingsLayout: settingsLayoutMeta,
  SidebarLayout: sidebarLayoutMeta,
  TopbarLayout: topbarLayoutMeta,
  ForgotPasswordForm: forgotPasswordFormMeta,
  OtpForm: otpFormMeta,
  SignInForm: signInFormMeta,
  SignUpForm: signUpFormMeta,
  CollectionEditor: collectionEditorMeta,
  ConfirmDialog: confirmDialogMeta,
  DisclosureSection: disclosureSectionMeta,
  EmptyState: emptyStateMeta,
  FilterBar: filterBarMeta,
  Hero: heroMeta,
  ImagePreview: imagePreviewMeta,
  ImageUploadField: imageUploadFieldMeta,
  InspectorField: inspectorFieldMeta,
  List: listMeta,
  ListRow: listRowMeta,
  ListSection: listSectionMeta,
  Notice: noticeMeta,
  Panel: panelMeta,
  ResponsivePanel: responsivePanelMeta,
  SectionHeader: sectionHeaderMeta,
  SelectableItem: selectableItemMeta,
  SelectionProvider: selectionProviderMeta,
  SettingsRow: settingsRowMeta,
  SwitchField: switchFieldMeta,
  ThemeComposer: themeComposerMeta,
  PaletteItem: paletteItemMeta,
  TileGrid: tileGridMeta,
  Timeline: timelineMeta,
  TreeItem: treeItemMeta,
  TreeView: treeViewMeta,
  ZoraDrawerContent: zoraDrawerContentMeta,
  ZoraTabBar: zoraTabBarMeta,
};
