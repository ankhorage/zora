import type { ZoraComponentMetaRegistry } from '../../types/authoring';
import { accordionItemMeta } from '../accordion/accordionItemMeta';
import { accordionMeta } from '../accordion/accordionMeta';
import { activityIndicatorMeta } from '../activity-indicator/activityIndicatorMeta';
import { appBarMeta } from '../app-bar/appBarMeta';
import { appHeaderMeta } from '../app-header/appHeaderMeta';
import { authScreenMeta } from '../auth/authScreenMeta';
import { forgotPasswordFormMeta } from '../auth/forgotPasswordFormMeta';
import { oauthProviderButtonMeta } from '../auth/oauthProviderButtonMeta';
import { oauthProviderListMeta } from '../auth/oauthProviderListMeta';
import { otpFormMeta } from '../auth/otpFormMeta';
import { signInFormMeta } from '../auth/signInFormMeta';
import { signUpFormMeta } from '../auth/signUpFormMeta';
import { avatarGroupMeta } from '../avatar/avatarGroupMeta';
import { avatarMeta } from '../avatar/avatarMeta';
import { badgeMeta } from '../badge/badgeMeta';
import { bottomSheetMeta } from '../bottom-sheet/bottomSheetMeta';
import { breadcrumbsMeta } from '../breadcrumbs/breadcrumbsMeta';
import { buttonGroupMeta } from '../button/buttonGroupMeta';
import { buttonMeta } from '../button/buttonMeta';
import { iconButtonMeta } from '../button/iconButtonMeta';
import { cardMeta } from '../card/cardMeta';
import { mediaCardMeta } from '../card/mediaCardMeta';
import { metricCardMeta } from '../card/metricCardMeta';
import { postCardMeta } from '../card/postCardMeta';
import { productCardMeta } from '../card/productCardMeta';
import { chatListItemMeta } from '../chat/chatListItemMeta';
import { messageBubbleMeta } from '../chat/messageBubbleMeta';
import { chessBoardMeta, openingBookMeta } from '../chess/meta';
import { chipGroupMeta } from '../chip/chipGroupMeta';
import { chipMeta } from '../chip/chipMeta';
import { collectionEditorMeta } from '../collection-editor/meta';
import { contentRailMeta } from '../content-rail/contentRailMeta';
import { dataTableMeta } from '../data-table/dataTableMeta';
import { datePickerMeta } from '../date-picker/datePickerMeta';
import { dialogMeta } from '../dialog/dialogMeta';
import { emptyStateMeta } from '../empty-state/emptyStateMeta';
import { explorerMeta, fileExplorerMeta, mediaExplorerMeta } from '../explorer/meta';
import { checkboxGroupMeta, checkboxMeta } from '../form/checkbox/checkboxMeta';
import { fieldMeta } from '../form/field/meta';
import { formActionsMeta } from '../form/formActionsMeta';
import { formErrorMeta } from '../form/formErrorMeta';
import { formMeta } from '../form/formMeta';
import { radioGroupMeta, radioMeta } from '../form/radio/radioMeta';
import { searchInputMeta } from '../form/search-input/searchInputMeta';
import { selectMeta } from '../form/select/selectMeta';
import { switchMeta } from '../form/switch/switchMeta';
import { textInputMeta } from '../form/text-input/textInputMeta';
import { gameEntityMeta } from '../game/meta/gameEntityMeta';
import { gameFieldMeta } from '../game/meta/gameFieldMeta';
import { gameInputZoneMeta } from '../game/meta/gameInputZoneMeta';
import { gameMeasurementProbeMeta } from '../game/meta/gameMeasurementProbeMeta';
import { gameMeta } from '../game/meta/gameMeta';
import { gameOverlayMeta } from '../game/meta/gameOverlayMeta';
import { gradientMeta } from '../gradient/gradientMeta';
import { gridLineOverlayMeta, gridRulerMeta } from '../grid-rulers/meta';
import { gridInteractionsMeta } from '../grid-interactions/meta';
import { gridViewMeta, tileGridMeta } from '../grid-view/meta';
import { heroMeta } from '../hero/heroMeta';
import { iconMeta } from '../icon/iconMeta';
import { imageMeta } from '../image/imageMeta';
import { keyboardAvoidingViewMeta } from '../keyboard-avoiding-view/keyboardAvoidingViewMeta';
import { appShellMeta } from '../layout/appShellMeta';
import { dividerMeta } from '../layout/dividerMeta';
import { gridMeta } from '../layout/gridMeta';
import { screenMeta } from '../layout/screenMeta';
import { scrollViewMeta } from '../layout/scrollViewMeta';
import { viewMeta } from '../layout/viewMeta';
import { flatListMeta } from '../list/flatListMeta';
import { listItemMeta, listMeta, listSectionMeta } from '../list/meta';
import { sectionListMeta } from '../list/sectionListMeta';
import { matrixGridMeta } from '../matrix-grid/meta';
import { missingElementMeta } from '../missing-element/missingElementMeta';
import { paginationMeta } from '../pagination/paginationMeta';
import { paletteItemMeta } from '../palette-item/paletteItemMeta';
import { popoverMenuMeta } from '../popover-menu/popoverMenuMeta';
import { progressMeta, progressRingMeta } from '../progress/progressMeta';
import { ratingMeta } from '../rating/ratingMeta';
import { readerMeta } from '../reader/meta';
import { barcodeScannerViewMeta, cameraPermissionViewMeta, scanOverlayMeta } from '../scanner/meta';
import { screenSectionMeta } from '../section/screenSectionMeta';
import { sectionHeaderMeta } from '../section/sectionHeaderMeta';
import { selectableItemMeta, selectionProviderMeta } from '../selection/meta';
import {
  skeletonCardMeta,
  skeletonListMeta,
  skeletonMeta,
  skeletonTextMeta,
} from '../skeleton/skeletonMeta';
import { spatialGridMeta } from '../spatial-grid/meta';
import { surfaceMeta } from '../surface/surfaceMeta';
import {
  cardBackMeta,
  cardHandMeta,
  playingCardMeta,
  pokerTrainingTableMeta,
  tabletopTableMeta,
} from '../tabletop/meta';
import { tabListMeta } from '../tabs/tabListMeta';
import { tabMeta } from '../tabs/tabMeta';
import { tabPanelMeta } from '../tabs/tabPanelMeta';
import { tabsMeta } from '../tabs/tabsMeta';
import { themeModeToggleMeta } from '../theme/ThemeModeToggle.meta';
import { timeGridMeta } from '../time-grid/meta';
import { timePickerMeta } from '../time-picker/timePickerMeta';
import { timelineMeta } from '../timeline/meta';
import { toastMeta } from '../toast/toastMeta';
import { toastProviderMeta } from '../toast/toastProviderMeta';
import { toolbarMeta } from '../toolbar/toolbarMeta';
import { treeItemMeta, treeViewMeta } from '../tree-view/meta';
import { headingMeta } from '../typography/headingMeta';
import { textMeta } from '../typography/textMeta';
import { uploaderMeta } from '../uploader/uploaderMeta';
import { finalizeFeatureMetadata } from './finalizeFeatureMetadata';

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
  AppHeader: appHeaderMeta,
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
  Game: gameMeta,
  GameField: gameFieldMeta,
  GameEntity: gameEntityMeta,
  GameInputZone: gameInputZoneMeta,
  GameMeasurementProbe: gameMeasurementProbeMeta,
  GameOverlay: gameOverlayMeta,
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
  AuthScreen: authScreenMeta,
  ForgotPasswordForm: forgotPasswordFormMeta,
  OAuthProviderButton: oauthProviderButtonMeta,
  OAuthProviderList: oauthProviderListMeta,
  OtpForm: otpFormMeta,
  SignInForm: signInFormMeta,
  SignUpForm: signUpFormMeta,
  ChatListItem: chatListItemMeta,
  ChessBoard: chessBoardMeta,
  CollectionEditor: collectionEditorMeta,
  ContentRail: contentRailMeta,
  EmptyState: emptyStateMeta,
  Explorer: explorerMeta,
  FileExplorer: fileExplorerMeta,
  MediaExplorer: mediaExplorerMeta,
  GridLineOverlay: gridLineOverlayMeta,
  GridRuler: gridRulerMeta,
  GridInteractions: gridInteractionsMeta,
  GridView: gridViewMeta,
  TileGrid: tileGridMeta,
  TimeGrid: timeGridMeta,
  MatrixGrid: matrixGridMeta,
  Hero: heroMeta,
  List: listMeta,
  ListItem: listItemMeta,
  ListSection: listSectionMeta,
  MessageBubble: messageBubbleMeta,
  OpeningBook: openingBookMeta,
  MissingElement: missingElementMeta,
  PostCard: postCardMeta,
  ProductCard: productCardMeta,
  Reader: readerMeta,
  BarcodeScannerView: barcodeScannerViewMeta,
  CameraPermissionView: cameraPermissionViewMeta,
  ScanOverlay: scanOverlayMeta,
  SectionHeader: sectionHeaderMeta,
  SelectableItem: selectableItemMeta,
  SpatialGrid: spatialGridMeta,
  SelectionProvider: selectionProviderMeta,
  PaletteItem: paletteItemMeta,
  Timeline: timelineMeta,
  CardBack: cardBackMeta,
  CardHand: cardHandMeta,
  PlayingCard: playingCardMeta,
  TabletopTable: tabletopTableMeta,
  PokerTrainingTable: pokerTrainingTableMeta,
  TreeItem: treeItemMeta,
  TreeView: treeViewMeta,
});
