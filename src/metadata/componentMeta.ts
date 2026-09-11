import { appBarMeta } from '../components/app-bar/meta';
import { breadcrumbsMeta } from '../components/breadcrumbs/meta';
import { checkboxGroupMeta, checkboxMeta } from '../components/checkbox/meta';
import { datePickerMeta } from '../components/date-picker/meta';
import { formActionsMeta, formErrorMeta, formFieldMeta, formMeta } from '../components/form/meta';
import { gradientMeta } from '../components/gradient/meta';
import { inputMeta } from '../components/input/meta';
import { dropdownMenuMeta, menuMeta } from '../components/menu/meta';
import { modalMeta } from '../components/modal/meta';
import { paginationMeta } from '../components/pagination/meta';
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
import { textareaMeta } from '../components/textarea/meta';
import { timePickerMeta } from '../components/time-picker/meta';
import { toastMeta, toastProviderMeta } from '../components/toast/meta';
import { toolbarActionMeta, toolbarMeta } from '../components/toolbar/meta';
import { avatarGroupMeta } from '../features/avatar/avatarGroupMeta';
import { avatarMeta } from '../features/avatar/avatarMeta';
import { badgeMeta } from '../features/badge/badgeMeta';
import { bottomSheetMeta } from '../features/bottom-sheet/bottomSheetMeta';
import { buttonGroupMeta } from '../features/button/buttonGroupMeta';
import { buttonMeta } from '../features/button/buttonMeta';
import { iconButtonMeta } from '../features/button/iconButtonMeta';
import { cardMeta } from '../features/card/cardMeta';
import { mediaCardMeta } from '../features/card/mediaCardMeta';
import { metricCardMeta } from '../features/card/metricCardMeta';
import { postCardMeta } from '../features/card/postCardMeta';
import { productCardMeta } from '../features/card/productCardMeta';
import { chipGroupMeta } from '../features/chip/chipGroupMeta';
import { chipMeta } from '../features/chip/chipMeta';
import { dataTableMeta } from '../features/data-table/dataTableMeta';
import { emptyStateMeta } from '../features/empty-state/emptyStateMeta';
import { iconMeta } from '../features/icon/iconMeta';
import { imageMeta } from '../features/image/imageMeta';
import { boxMeta } from '../features/layout/boxMeta';
import { containerMeta } from '../features/layout/containerMeta';
import { contentRailMeta } from '../features/layout/contentRailMeta';
import { dividerMeta } from '../features/layout/dividerMeta';
import { gridMeta } from '../features/layout/gridMeta';
import { stackMeta } from '../features/layout/stackMeta';
import { flatListMeta } from '../features/list/flatListMeta';
import { sectionListMeta } from '../features/list/sectionListMeta';
import { progressMeta, progressRingMeta } from '../features/progress/progressMeta';
import { splashScreenMeta } from '../features/splash-screen/splashScreenMeta';
import { surfaceMeta } from '../features/surface/surfaceMeta';
import { headingMeta } from '../features/typography/headingMeta';
import { textMeta } from '../features/typography/textMeta';
import { uploaderMeta } from '../features/uploader/uploaderMeta';
import { foundationMetas } from '../foundation/meta';
import { appShellMeta } from '../layout/app-shell/meta';
import { screenMeta } from '../layout/screen/meta';
import { screenSectionMeta } from '../layout/screen-section/meta';
import { settingsLayoutMeta } from '../layout/settings-layout/meta';
import { sidebarLayoutMeta } from '../layout/sidebar-layout/meta';
import { topbarLayoutMeta } from '../layout/topbar-layout/meta';
import {
  forgotPasswordFormMeta,
  oauthProviderButtonMeta,
  oauthProviderListMeta,
  otpFormMeta,
  signInFormMeta,
  signUpFormMeta,
} from '../patterns/auth/meta';
import { chatListItemMeta } from '../patterns/chat-list-item/meta';
import { collectionEditorMeta } from '../patterns/collection-editor/meta';
import { confirmDialogMeta } from '../patterns/confirm-dialog/meta';
import { disclosureSectionMeta } from '../patterns/disclosure-section/meta';
import { filterBarMeta } from '../patterns/filter-bar/meta';
import { heroMeta } from '../patterns/hero/meta';
import { inspectorFieldMeta } from '../patterns/inspector-field/meta';
import { listMeta, listRowMeta, listSectionMeta } from '../patterns/list/meta';
import { messageBubbleMeta } from '../patterns/message-bubble/meta';
import { missingElementMeta } from '../patterns/missing-element/meta';
import { noticeMeta } from '../patterns/notice/meta';
import { panelMeta } from '../patterns/panel/meta';
import { readerSurfaceMeta } from '../patterns/reader/meta';
import {
  barcodeScannerViewMeta,
  cameraPermissionViewMeta,
  scanOverlayMeta,
} from '../patterns/scanner/meta';
import { sectionHeaderMeta } from '../patterns/section-header/meta';
import { selectableItemMeta, selectionProviderMeta } from '../patterns/selection/meta';
import { settingsRowMeta } from '../patterns/settings-row/meta';
import { switchFieldMeta } from '../patterns/switch-field/meta';
import { themeComposerMeta } from '../patterns/theme-composer/meta';
import { paletteItemMeta, tileGridMeta } from '../patterns/tile-grid/meta';
import { timelineMeta } from '../patterns/timeline/meta';
import { treeItemMeta, treeViewMeta } from '../patterns/tree-view/meta';
import { themeModeToggleMeta } from '../theme/ThemeModeToggle.meta';
import { finalizeFeatureMetadata } from '../utils/finalizeFeatureMetadata';
import type { ZoraComponentMetaRegistry } from './types';

export const ZORA_COMPONENT_META: ZoraComponentMetaRegistry = finalizeFeatureMetadata({
  ...foundationMetas,
  Box: boxMeta,
  Container: containerMeta,
  Stack: stackMeta,
  Grid: gridMeta,
  Divider: dividerMeta,
  Surface: surfaceMeta,
  AppBar: appBarMeta,
  Avatar: avatarMeta,
  AvatarGroup: avatarGroupMeta,
  Badge: badgeMeta,
  Breadcrumbs: breadcrumbsMeta,
  Button: buttonMeta,
  ButtonGroup: buttonGroupMeta,
  Card: cardMeta,
  Checkbox: checkboxMeta,
  CheckboxGroup: checkboxGroupMeta,
  Chip: chipMeta,
  ChipGroup: chipGroupMeta,
  DataTable: dataTableMeta,
  DatePicker: datePickerMeta,
  DropdownMenu: dropdownMenuMeta,
  Form: formMeta,
  FormActions: formActionsMeta,
  FormError: formErrorMeta,
  FormField: formFieldMeta,
  Gradient: gradientMeta,
  Heading: headingMeta,
  Icon: iconMeta,
  IconButton: iconButtonMeta,
  Image: imageMeta,
  Input: inputMeta,
  MediaCard: mediaCardMeta,
  Menu: menuMeta,
  MetricCard: metricCardMeta,
  Modal: modalMeta,
  Pagination: paginationMeta,
  Progress: progressMeta,
  ProgressRing: progressRingMeta,
  Radio: radioMeta,
  RadioGroup: radioGroupMeta,
  Rating: ratingMeta,
  SearchBar: searchBarMeta,
  Select: selectMeta,
  Skeleton: skeletonMeta,
  SkeletonCard: skeletonCardMeta,
  SkeletonList: skeletonListMeta,
  SkeletonText: skeletonTextMeta,
  SplashScreen: splashScreenMeta,
  Tabs: tabsMeta,
  Text: textMeta,
  Textarea: textareaMeta,
  TimePicker: timePickerMeta,
  Toast: toastMeta,
  ToastProvider: toastProviderMeta,
  Toolbar: toolbarMeta,
  ToolbarAction: toolbarActionMeta,
  Uploader: uploaderMeta,
  BottomSheet: bottomSheetMeta,
  FlatList: flatListMeta,
  SectionList: sectionListMeta,
  ThemeModeToggle: themeModeToggleMeta,
  AppShell: appShellMeta,
  Screen: screenMeta,
  ScreenSection: screenSectionMeta,
  SettingsLayout: settingsLayoutMeta,
  SidebarLayout: sidebarLayoutMeta,
  TopbarLayout: topbarLayoutMeta,
  ForgotPasswordForm: forgotPasswordFormMeta,
  OAuthProviderButton: oauthProviderButtonMeta,
  OAuthProviderList: oauthProviderListMeta,
  OtpForm: otpFormMeta,
  SignInForm: signInFormMeta,
  SignUpForm: signUpFormMeta,
  ChatListItem: chatListItemMeta,
  CollectionEditor: collectionEditorMeta,
  ConfirmDialog: confirmDialogMeta,
  ContentRail: contentRailMeta,
  DisclosureSection: disclosureSectionMeta,
  EmptyState: emptyStateMeta,
  FilterBar: filterBarMeta,
  Hero: heroMeta,
  InspectorField: inspectorFieldMeta,
  List: listMeta,
  ListRow: listRowMeta,
  ListSection: listSectionMeta,
  MessageBubble: messageBubbleMeta,
  MissingElement: missingElementMeta,
  Notice: noticeMeta,
  Panel: panelMeta,
  PostCard: postCardMeta,
  ProductCard: productCardMeta,
  ReaderSurface: readerSurfaceMeta,
  BarcodeScannerView: barcodeScannerViewMeta,
  CameraPermissionView: cameraPermissionViewMeta,
  ScanOverlay: scanOverlayMeta,
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
});
