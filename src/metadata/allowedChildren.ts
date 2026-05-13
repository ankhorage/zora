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
  'MessageBubble',
] as const;

export const SCREEN_SECTION_ALLOWED_CHILDREN = [...CONTAINER_ALLOWED_CHILDREN] as const;

export const SCREEN_ALLOWED_CHILDREN = [
  'ScreenSection',
  ...CONTAINER_ALLOWED_CHILDREN,
] as const;
