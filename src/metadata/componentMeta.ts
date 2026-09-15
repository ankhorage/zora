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
import { chatListItemMeta } from '../features/chat/chatListItemMeta';
import { messageBubbleMeta } from '../features/chat/messageBubbleMeta';
import { chipGroupMeta } from '../features/chip/chipGroupMeta';
import { chipMeta } from '../features/chip/chipMeta';
import { collectionEditorMeta } from '../features/collection-editor/meta';
import { contentRailMeta } from '../features/content-rail/contentRailMeta';
import { dataTableMeta } from '../features/data-table/dataTableMeta';
import { datePickerMeta } from '../features/date-picker/datePickerMeta';
import { dialogMeta } from '../features/dialog/dialogMeta';
import { emptyStateMeta } from '../features/empty-state/emptyStateMeta';
import { checkboxGroupMeta, checkboxMeta } from '../features/form/checkbox/checkboxMeta';
import { fieldMeta } from '../features/form/field/meta';
import { formActionsMeta } from '../features/form/formActionsMeta';
import { formErrorMeta } from '../features/form/formErrorMeta';
import { formMeta } from '../features/form/formMeta';
import { radioGroupMeta, radioMeta } from '../features/form/radio/radioMeta';
import { searchInputMeta } from '../features/form/search-input/searchInputMeta';
import { selectMeta } from '../features/form/select/selectMeta';
import { switchMeta } from '../features/form/switch/switchMeta';
import { textInputMeta } from '../features/form/text-input/textInputMeta';
import { gradientMeta } from '../features/gradient/gradientMeta';
import { heroMeta } from '../features/hero/heroMeta';
import { iconMeta } from '../features/icon/iconMeta';
import { imageMeta } from '../features/image/imageMeta';
import { keyboardAvoidingViewMeta } from '../features/keyboard-avoiding-view/keyboardAvoidingViewMeta';
import { appShellMeta } from '../features/layout/appShellMeta';
import { dividerMeta } from '../features/layout/dividerMeta';
import { gridMeta } from '../features/layout/gridMeta';
import { screenMeta } from '../features/layout/screenMeta';
import { scrollViewMeta } from '../features/layout/scrollViewMeta';
import { viewMeta } from '../features/layout/viewMeta';
import { flatListMeta } from '../features/list/flatListMeta';
import { listItemMeta, listMeta, listSectionMeta } from '../features/list/meta';
import { sectionListMeta } from '../features/list/sectionListMeta';
import { missingElementMeta } from '../features/missing-element/missingElementMeta';
import { paginationMeta } from '../features/pagination/paginationMeta';
import { paletteItemMeta } from '../features/palette-item/paletteItemMeta';
import { popoverMenuMeta } from '../features/popover-menu/popoverMenuMeta';
import { progressMeta, progressRingMeta } from '../features/progress/progressMeta';
import { ratingMeta } from '../features/rating/ratingMeta';
import { readerSurfaceMeta } from '../features/reader/meta';
import {
  barcodeScannerViewMeta,
  cameraPermissionViewMeta,
  scanOverlayMeta,
} from '../features/scanner/meta';
import { screenSectionMeta } from '../features/section/screenSectionMeta';
import { sectionHeaderMeta } from '../features/section/sectionHeaderMeta';
import { selectableItemMeta, selectionProviderMeta } from '../features/selection/meta';
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
import { timelineMeta } from '../features/timeline/meta';
import { toastMeta } from '../features/toast/toastMeta';
import { toastProviderMeta } from '../features/toast/toastProviderMeta';
import { toolbarMeta } from '../features/toolbar/toolbarMeta';
import { treeItemMeta, treeViewMeta } from '../features/tree-view/meta';
import { headingMeta } from '../features/typography/headingMeta';
import { textMeta } from '../features/typography/textMeta';
import { uploaderMeta } from '../features/uploader/uploaderMeta';
import { themeModeToggleMeta } from '../theme/ThemeModeToggle.meta';
import { finalizeFeatureMetadata } from '../utils/finalizeFeatureMetadata';
import type { ZoraComponentMetaRegistry } from './types';

export const ZORA_COMPONENT_META: ZoraComponentMetaRegistry = finalizeFeatureMetadata({
  Accordion: accordionMeta,
  AccordionItem: accordionItemMeta,
  ActivityIndicator: activityIndicatorMeta,
  View: viewMeta,
  ScrollView: scrollViewMeta,
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
  Field: fieldMeta,
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
  Switch: switchMeta,
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
  ForgotPasswordForm: forgotPasswordFormMeta,
  OAuthProviderButton: oauthProviderButtonMeta,
  OAuthProviderList: oauthProviderListMeta,
  OtpForm: otpFormMeta,
  SignInForm: signInFormMeta,
  SignUpForm: signUpFormMeta,
  ChatListItem: chatListItemMeta,
  CollectionEditor: collectionEditorMeta,
  ContentRail: contentRailMeta,
  EmptyState: emptyStateMeta,
  Hero: heroMeta,
  List: listMeta,
  ListItem: listItemMeta,
  ListSection: listSectionMeta,
  MessageBubble: messageBubbleMeta,
  MissingElement: missingElementMeta,
  PostCard: postCardMeta,
  ProductCard: productCardMeta,
  ReaderSurface: readerSurfaceMeta,
  BarcodeScannerView: barcodeScannerViewMeta,
  CameraPermissionView: cameraPermissionViewMeta,
  ScanOverlay: scanOverlayMeta,
  SectionHeader: sectionHeaderMeta,
  SelectableItem: selectableItemMeta,
  SelectionProvider: selectionProviderMeta,
  PaletteItem: paletteItemMeta,
  Timeline: timelineMeta,
  TreeItem: treeItemMeta,
  TreeView: treeViewMeta,
});
