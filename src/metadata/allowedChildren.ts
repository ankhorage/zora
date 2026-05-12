export const CONTAINER_ALLOWED_CHILDREN = [
  'Box',
  'Stack',
  'Grid',
  'Container',
  'Divider',
  'Text',
  'Heading',
  'Button',
  'Input',
  'Textarea',
  'FormField',
  'Card',
  'Panel',
  'Notice',
  'EmptyState',
  'SectionHeader',
  'SettingsRow',
  'PostCard',
  'ChatListItem',
] as const;

export const PAGE_SECTION_ALLOWED_CHILDREN = [...CONTAINER_ALLOWED_CHILDREN] as const;

export const PAGE_ALLOWED_CHILDREN = [
  'PageHeader',
  'PageSection',
  ...CONTAINER_ALLOWED_CHILDREN,
] as const;
