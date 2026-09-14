import { accordionItemMeta } from '../features/accordion/accordionItemMeta';
import { accordionMeta } from '../features/accordion/accordionMeta';
import { activityIndicatorMeta } from '../features/activity-indicator/activityIndicatorMeta';
import { appBarMeta } from '../features/app-bar/appBarMeta';
import { forgotPasswordFormMeta } from '../features/auth/forgotPasswordFormMeta';
import { oauthProviderButtonMeta } from '../features/auth/oauthProviderButtonMeta';
import { oauthProviderListMeta } from '../features/auth/oauthProviderListMeta';
import { otpFormMeta } from '../features/auth/otpFormMeta';
import { signInFormMeta } from '../features/auth/signInFormMeta';
import { signUpFormMeta } from '../features/auth/signUpFormMeta';
import { avatarGroupMeta } from '../features/avatar/avatarGroupMeta';
import { avatarMeta } from '../features/avatar/avatarMeta';
import { badgeMeta } from '../features/badge/badgeMeta';
import { bottomSheetMeta } from '../features/bottom-sheet/bottomSheetMeta';
import { breadcrumbsMeta } from '../features/breadcrumbs/breadcrumbsMeta';
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
import { datePickerMeta } from '../features/date-picker/datePickerMeta';
import { dialogMeta } from '../features/dialog/dialogMeta';
import { emptyStateMeta } from '../features/empty-state/emptyStateMeta';
import { checkboxGroupMeta, checkboxMeta } from '../features/form/checkbox/checkboxMeta';
import { formActionsMeta } from '../features/form/formActionsMeta';
import { formErrorMeta } from '../features/form/formErrorMeta';
import { formFieldMeta } from '../features/form/formFieldMeta';
import { formMeta } from '../features/form/formMeta';
import { radioGroupMeta, radioMeta } from '../features/form/radio/radioMeta';
import { searchInputMeta } from '../features/form/search-input/searchInputMeta';
import { selectMeta } from '../features/form/select/selectMeta';
import { textInputMeta } from '../features/form/text-input/textInputMeta';
import { gradientMeta } from '../features/gradient/gradientMeta';
import { heroMeta } from '../features/hero/heroMeta';
import { iconMeta } from '../features/icon/iconMeta';
import { imageMeta } from '../features/image/imageMeta';
import { keyboardAvoidingViewMeta } from '../features/keyboard-avoiding-view/keyboardAvoidingViewMeta';
import { boxMeta } from '../features/layout/boxMeta';
import { containerMeta } from '../features/layout/containerMeta';
import { contentRailMeta } from '../features/layout/contentRailMeta';
import { dividerMeta } from '../features/layout/dividerMeta';
import { gridMeta } from '../features/layout/gridMeta';
import { stackMeta } from '../features/layout/stackMeta';
import { flatListMeta } from '../features/list/flatListMeta';
import { sectionListMeta } from '../features/list/sectionListMeta';
import { missingElementMeta } from '../features/missing-element/missingElementMeta';
import { paginationMeta } from '../features/pagination/paginationMeta';
import { popoverMenuMeta } from '../features/popover-menu/popoverMenuMeta';
import { progressMeta, progressRingMeta } from '../features/progress/progressMeta';
import { ratingMeta } from '../features/rating/ratingMeta';
import {
  skeletonCardMeta,
  skeletonListMeta,
  skeletonMeta,
  skeletonTextMeta,
} from '../features/skeleton/skeletonMeta';
import { surfaceMeta } from '../features/surface/surfaceMeta';
import { tabListMeta } from '../features/tabs/tabListMeta';
import { tabMeta } from '../features/tabs/tabMeta';
import { tabPanelMeta } from '../features/tabs/tabPanelMeta';
import { tabsMeta } from '../features/tabs/tabsMeta';
import { timePickerMeta } from '../features/time-picker/timePickerMeta';
import { toastMeta } from '../features/toast/toastMeta';
import { toastProviderMeta } from '../features/toast/toastProviderMeta';
import { toolbarMeta } from '../features/toolbar/toolbarMeta';
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
import { chatListItemMeta } from '../patterns/chat-list-item/meta';
import { collectionEditorMeta } from '../patterns/collection-editor/meta';
import { confirmDialogMeta } from '../patterns/confirm-dialog/meta';
import { filterBarMeta } from '../patterns/filter-bar/meta';
import { inspectorFieldMeta } from '../patterns/inspector-field/meta';
import { listMeta, listRowMeta, listSectionMeta } from '../patterns/list/meta';
import { messageBubbleMeta } from '../patterns/message-bubble/meta';
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
  Accordion: accordionMeta,
  AccordionItem: accordionItemMeta,
  ActivityIndicator: activityIndicatorMeta,
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
  Dialog: dialogMeta,
  Form: formMeta,
  FormActions: formActionsMeta,
  FormError: formErrorMeta,
  FormField: formFieldMeta,
  Gradient: gradientMeta,
  Heading: headingMeta,
  Icon: iconMeta,
  IconButton: iconButtonMeta,
  Image: imageMeta,
  KeyboardAvoidingView: keyboardAvoidingViewMeta,
  TextInput: textInputMeta,
  MediaCard: mediaCardMeta,
  MetricCard: metricCardMeta,
  Pagination: paginationMeta,
  PopoverMenu: popoverMenuMeta,
  Progress: progressMeta,
  ProgressRing: progressRingMeta,
  Radio: radioMeta,
  RadioGroup: radioGroupMeta,
  Rating: ratingMeta,
  SearchInput: searchInputMeta,
  Select: selectMeta,
  Skeleton: skeletonMeta,
  SkeletonCard: skeletonCardMeta,
  SkeletonList: skeletonListMeta,
  SkeletonText: skeletonTextMeta,
  Tab: tabMeta,
  TabList: tabListMeta,
  TabPanel: tabPanelMeta,
  Tabs: tabsMeta,
  Text: textMeta,
  TimePicker: timePickerMeta,
  Toast: toastMeta,
  ToastProvider: toastProviderMeta,
  Toolbar: toolbarMeta,
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
