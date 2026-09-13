export const COMPONENT_THEME_AUTHORING = {
  authority: 'theme',
  scope: 'component',
  allowInstanceOverride: true,
} as const;

export const FEATURE_MANIFEST_ELEMENTS = {
  surface: ['Surface'],
  avatar: ['Avatar', 'AvatarGroup'],
  badge: ['Badge'],
  card: ['Card', 'MediaCard', 'MetricCard', 'PostCard', 'ProductCard'],
  chip: ['Chip', 'ChipGroup'],
  'data-table': ['DataTable'],
  'date-picker': ['DatePicker'],
  form: ['Form', 'FormError', 'FormField'],
  button: ['Button', 'IconButton', 'ButtonGroup'],
  icon: ['Icon'],
  image: ['Image'],
  'keyboard-avoiding-view': ['KeyboardAvoidingView'],
  layout: ['Box', 'Container', 'ContentRail', 'Divider', 'Grid', 'Stack'],
  list: ['FlatList', 'SectionList'],
  skeleton: ['Skeleton', 'SkeletonCard', 'SkeletonList', 'SkeletonText'],
  typography: ['Heading', 'Text'],
  'time-picker': ['TimePicker'],
  uploader: ['Uploader'],
  'bottom-sheet': ['BottomSheet'],
} as const;
