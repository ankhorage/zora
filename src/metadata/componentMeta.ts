import { appBarMeta } from '../components/app-bar/meta';
import { avatarMeta } from '../components/avatar/meta';
import { avatarGroupMeta } from '../components/avatar-group/meta';
import { badgeMeta } from '../components/badge/meta';
import { buttonMeta } from '../components/button/meta';
import { buttonGroupMeta } from '../components/button-group/meta';
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
import {
  skeletonCardMeta,
  skeletonListMeta,
  skeletonMeta,
  skeletonTextMeta,
} from '../components/skeleton/meta';
import { tabsMeta } from '../components/tabs/meta';
import { textMeta } from '../components/text/meta';
import { textareaMeta } from '../components/textarea/meta';
import { toastMeta, toastProviderMeta } from '../components/toast/meta';
import { toolbarActionMeta, toolbarMeta } from '../components/toolbar/meta';
import { foundationMetas } from '../foundation/meta';
import { appShellMeta } from '../layout/app-shell/meta';
import { screenMeta } from '../layout/screen/meta';
import { screenSectionMeta } from '../layout/screen-section/meta';
import { settingsLayoutMeta } from '../layout/settings-layout/meta';
import { sidebarLayoutMeta } from '../layout/sidebar-layout/meta';
import { topbarLayoutMeta } from '../layout/topbar-layout/meta';
import {
  forgotPasswordFormMeta,
  otpFormMeta,
  signInFormMeta,
  signUpFormMeta,
} from '../patterns/auth/meta';
import { chatListItemMeta } from '../patterns/chat-list-item/meta';
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
import { messageBubbleMeta } from '../patterns/message-bubble/meta';
import { noticeMeta } from '../patterns/notice/meta';
import { panelMeta } from '../patterns/panel/meta';
import { postCardMeta } from '../patterns/post-card/meta';
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
  ButtonGroup: buttonGroupMeta,
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
  Skeleton: skeletonMeta,
  SkeletonCard: skeletonCardMeta,
  SkeletonList: skeletonListMeta,
  SkeletonText: skeletonTextMeta,
  Tabs: tabsMeta,
  Text: textMeta,
  Textarea: textareaMeta,
  Toast: toastMeta,
  ToastProvider: toastProviderMeta,
  Toolbar: toolbarMeta,
  ToolbarAction: toolbarActionMeta,
  AppShell: appShellMeta,
  Screen: screenMeta,
  ScreenSection: screenSectionMeta,
  SettingsLayout: settingsLayoutMeta,
  SidebarLayout: sidebarLayoutMeta,
  TopbarLayout: topbarLayoutMeta,
  ForgotPasswordForm: forgotPasswordFormMeta,
  OtpForm: otpFormMeta,
  SignInForm: signInFormMeta,
  SignUpForm: signUpFormMeta,
  ChatListItem: chatListItemMeta,
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
  MessageBubble: messageBubbleMeta,
  Notice: noticeMeta,
  Panel: panelMeta,
  PostCard: postCardMeta,
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
