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
  button: ['Button', 'IconButton', 'ButtonGroup'],
  icon: ['Icon'],
  image: ['Image'],
  layout: ['Box', 'Container', 'ContentRail', 'Divider', 'Grid', 'Stack'],
  list: ['FlatList', 'SectionList'],
  'splash-screen': ['SplashScreen'],
  typography: ['Heading', 'Text'],
  uploader: ['Uploader'],
  'bottom-sheet': ['BottomSheet'],
} as const;
