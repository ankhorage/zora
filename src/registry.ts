import type { InteractionPolicyProps } from '@ankhorage/surface';
import type React from 'react';

import { AppBar } from './components/app-bar';
import { Breadcrumbs } from './components/breadcrumbs';
import { DropdownMenu, Menu } from './components/menu';
import { Modal } from './components/modal';
import { Pagination } from './components/pagination';
import { Rating } from './components/rating';
import { SearchBar } from './components/search-bar';
import { Select } from './components/select';
import { Tabs } from './components/tabs';
import { Toolbar, ToolbarAction } from './components/toolbar';
import { Accordion, AccordionItem } from './features/accordion/public';
import { ActivityIndicator } from './features/activity-indicator/public';
import {
  ForgotPasswordForm,
  OAuthProviderButton,
  OAuthProviderList,
  OtpForm,
  SignInForm,
  SignUpForm,
} from './features/auth/public';
import { Avatar } from './features/avatar/public';
import { AvatarGroup } from './features/avatar/public';
import { Badge } from './features/badge/public';
import { BottomSheet } from './features/bottom-sheet/public';
import { Button } from './features/button/public';
import { ButtonGroup } from './features/button/public';
import { IconButton } from './features/button/public';
import { Card } from './features/card/public';
import { MediaCard } from './features/card/public';
import { MetricCard } from './features/card/public';
import { PostCard } from './features/card/public';
import { ProductCard } from './features/card/public';
import { Chip } from './features/chip/public';
import { ChipGroup } from './features/chip/public';
import { DataTable } from './features/data-table/public';
import { DatePicker } from './features/date-picker/public';
import { EmptyState } from './features/empty-state/public';
import { Checkbox, CheckboxGroup } from './features/form/checkbox/public';
import { Form, FormActions, FormError, FormField } from './features/form/public';
import { Radio, RadioGroup } from './features/form/radio/public';
import { TextInput } from './features/form/text-input/public';
import { Gradient } from './features/gradient/public';
import { Hero } from './features/hero/public';
import { Icon } from './features/icon/public';
import { Image } from './features/image/public';
import { KeyboardAvoidingView } from './features/keyboard-avoiding-view/public';
import { Box, Container, Divider, Grid, Stack } from './features/layout/public';
import { ContentRail } from './features/layout/public';
import { FlatList, SectionList } from './features/list/public';
import { MissingElement } from './features/missing-element/public';
import { Progress, ProgressRing } from './features/progress/public';
import { Skeleton, SkeletonCard, SkeletonList, SkeletonText } from './features/skeleton/public';
import { Surface } from './features/surface/public';
import { TimePicker } from './features/time-picker/public';
import { Toast } from './features/toast/public';
import { Heading } from './features/typography/public';
import { Text } from './features/typography/public';
import { Uploader } from './features/uploader/public';
import { Center, Inline, Show, Spacer } from './foundation';
import { AppShell } from './layout/app-shell';
import { Screen } from './layout/screen';
import { ScreenSection } from './layout/screen-section';
import { SettingsLayout } from './layout/settings-layout';
import { SidebarLayout } from './layout/sidebar-layout';
import { TopbarLayout } from './layout/topbar-layout';
import { ChatListItem } from './patterns/chat-list-item';
import { CollectionEditor } from './patterns/collection-editor';
import { ConfirmDialog } from './patterns/confirm-dialog';
import { FilterBar } from './patterns/filter-bar';
import { InspectorField } from './patterns/inspector-field';
import { List, ListRow, ListSection } from './patterns/list';
import { MessageBubble } from './patterns/message-bubble';
import { Notice } from './patterns/notice';
import { Panel } from './patterns/panel';
import { ReaderSurface } from './patterns/reader';
import { BarcodeScannerView, CameraPermissionView, ScanOverlay } from './patterns/scanner';
import { SectionHeader } from './patterns/section-header';
import { SelectableItem } from './patterns/selection';
import { SettingsRow } from './patterns/settings-row';
import { SwitchField } from './patterns/switch-field';
import { ThemeComposer } from './patterns/theme-composer';
import { PaletteItem, TileGrid } from './patterns/tile-grid';
import { Timeline } from './patterns/timeline';
import { TreeItem, TreeView } from './patterns/tree-view';
import { ThemeModeToggle } from './theme/ThemeModeToggle';

export type ZoraComponentRegistry = Readonly<Record<string, React.ElementType>>;

type ComponentPropsFor<K extends keyof typeof _ZORA_COMPONENT_REGISTRY> = React.ComponentProps<
  (typeof _ZORA_COMPONENT_REGISTRY)[K]
>;

type AcceptsSurfaceInteractionPolicyProps<P> = 'interactionPolicy' extends keyof P
  ? InteractionPolicyProps extends Pick<P, 'interactionPolicy'>
    ? Pick<P, 'interactionPolicy'> extends InteractionPolicyProps
      ? true
      : false
    : false
  : false;

type RegistryInteractionPolicyContract = {
  [K in keyof typeof _ZORA_COMPONENT_REGISTRY]: AcceptsSurfaceInteractionPolicyProps<
    ComponentPropsFor<K>
  >;
};

type _AssertTrue<T extends true> = T;
type _RegistryInteractionPolicyCheck = _AssertTrue<
  RegistryInteractionPolicyContract[keyof typeof _ZORA_COMPONENT_REGISTRY]
>;

const _ZORA_COMPONENT_REGISTRY = {
  Accordion,
  AccordionItem,
  ActivityIndicator,
  AppBar,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  CheckboxGroup,
  Chip,
  ChipGroup,
  DataTable,
  DatePicker,
  DropdownMenu,
  Form,
  FormActions,
  FormError,
  FormField,
  Gradient,
  Heading,
  Icon,
  IconButton,
  Image,
  KeyboardAvoidingView,
  TextInput,
  MediaCard,
  Menu,
  MetricCard,
  Modal,
  Pagination,
  Progress,
  ProgressRing,
  Radio,
  RadioGroup,
  Rating,
  SearchBar,
  Select,
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
  Tabs,
  Text,
  TimePicker,
  Toast,
  Toolbar,
  ToolbarAction,
  Uploader,
  BottomSheet,
  FlatList,
  SectionList,
  ThemeModeToggle,
  Box,
  Center,
  Container,
  Divider,
  Grid,
  Inline,
  Show,
  Spacer,
  Stack,
  Surface,
  AppShell,
  Screen,
  ScreenSection,
  SettingsLayout,
  SidebarLayout,
  TopbarLayout,
  ForgotPasswordForm,
  OAuthProviderButton,
  OAuthProviderList,
  OtpForm,
  SignInForm,
  SignUpForm,
  ChatListItem,
  CollectionEditor,
  ConfirmDialog,
  ContentRail,
  EmptyState,
  FilterBar,
  Hero,
  InspectorField,
  List,
  ListRow,
  ListSection,
  MessageBubble,
  MissingElement,
  Notice,
  Panel,
  PostCard,
  ProductCard,
  ReaderSurface,
  BarcodeScannerView,
  CameraPermissionView,
  ScanOverlay,
  SectionHeader,
  SelectableItem,
  SettingsRow,
  SwitchField,
  ThemeComposer,
  PaletteItem,
  TileGrid,
  Timeline,
  TreeItem,
  TreeView,
} as const satisfies ZoraComponentRegistry;

export const ZORA_COMPONENT_REGISTRY: ZoraComponentRegistry = _ZORA_COMPONENT_REGISTRY;
