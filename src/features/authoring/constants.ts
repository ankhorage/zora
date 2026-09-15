import type { ZoraThemeTokenFamily } from '../../types/theme-recipe';

export const COMPONENT_THEME_AUTHORING = {
  authority: 'theme',
  scope: 'component',
  allowInstanceOverride: true,
} as const;

export const FEATURE_MANIFEST_ELEMENTS = {
  auth: [
    'ForgotPasswordForm',
    'OAuthProviderButton',
    'OAuthProviderList',
    'OtpForm',
    'SignInForm',
    'SignUpForm',
  ],
  surface: ['Surface'],
  avatar: ['Avatar', 'AvatarGroup'],
  badge: ['Badge'],
  card: ['Card', 'MediaCard', 'MetricCard', 'PostCard', 'ProductCard'],
  chip: ['Chip', 'ChipGroup'],
  'data-table': ['DataTable'],
  'date-picker': ['DatePicker'],
  dialog: ['Dialog'],
  form: ['Form', 'FormError', 'Field'],
  gradient: ['Gradient'],
  button: ['Button', 'IconButton', 'ButtonGroup'],
  icon: ['Icon'],
  image: ['Image'],
  'keyboard-avoiding-view': ['KeyboardAvoidingView'],
  'content-rail': ['ContentRail'],
  layout: ['Divider', 'Grid', 'Screen', 'ScrollView', 'View'],
  section: ['ScreenSection', 'SectionHeader'],
  list: ['FlatList', 'SectionList'],
  pagination: ['Pagination'],
  rating: ['Rating'],
  skeleton: ['Skeleton', 'SkeletonCard', 'SkeletonList', 'SkeletonText'],
  tabs: ['Tabs', 'TabList', 'Tab', 'TabPanel'],
  toolbar: ['Toolbar'],
  typography: ['Heading', 'Text'],
  'time-picker': ['TimePicker'],
  uploader: ['Uploader'],
  'bottom-sheet': ['BottomSheet'],
} as const;

export const ZORA_THEME_TOKEN_FAMILIES = [
  'colors',
  'spacing',
  'radii',
  'typography',
  'shadows',
] as const satisfies readonly ZoraThemeTokenFamily[];
