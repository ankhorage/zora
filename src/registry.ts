import type React from 'react';

import { ActionSheet, ActionSheetItem } from './components/action-sheet';
import { AppBar } from './components/app-bar';
import { Avatar } from './components/avatar';
import { AvatarGroup } from './components/avatar-group';
import { Badge } from './components/badge';
import { Breadcrumbs } from './components/breadcrumbs';
import { Button } from './components/button';
import { ButtonGroup } from './components/button-group';
import { Card } from './components/card';
import { Checkbox, CheckboxGroup } from './components/checkbox';
import { Chip } from './components/chip';
import { ChipGroup } from './components/chip-group';
import { DataTable } from './components/data-table';
import { DatePicker } from './components/date-picker';
import { Drawer } from './components/drawer';
import { Form, FormActions, FormError, FormField } from './components/form';
import { Gradient } from './components/gradient';
import { Heading } from './components/heading';
import { Icon } from './components/icon';
import { IconButton } from './components/icon-button';
import { Image } from './components/image';
import { Input } from './components/input';
import { MediaCard } from './components/media-card';
import { DropdownMenu, Menu } from './components/menu';
import { MetricCard } from './components/metric-card';
import { Modal } from './components/modal';
import { NavigationItem } from './components/navigation-item';
import { NavigationList } from './components/navigation-list';
import { Pagination } from './components/pagination';
import { Progress } from './components/progress';
import { Radio, RadioGroup } from './components/radio';
import { Rating } from './components/rating';
import { SearchBar } from './components/search-bar';
import { Select } from './components/select';
import { Skeleton, SkeletonCard, SkeletonList, SkeletonText } from './components/skeleton';
import { SplashScreen } from './components/splash-screen';
import { Tabs } from './components/tabs';
import { Text } from './components/text';
import { Textarea } from './components/textarea';
import { TimePicker } from './components/time-picker';
import { Toast } from './components/toast';
import { Toolbar, ToolbarAction } from './components/toolbar';
import {
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
} from './foundation';
import { AppShell } from './layout/app-shell';
import { Screen } from './layout/screen';
import { ScreenSection } from './layout/screen-section';
import { SettingsLayout } from './layout/settings-layout';
import { SidebarLayout } from './layout/sidebar-layout';
import { TopbarLayout } from './layout/topbar-layout';
import {
  ForgotPasswordForm,
  OAuthProviderButton,
  OAuthProviderList,
  OtpForm,
  SignInForm,
  SignUpForm,
} from './patterns/auth';
import { ChatListItem } from './patterns/chat-list-item';
import { CollectionEditor } from './patterns/collection-editor';
import { ConfirmDialog } from './patterns/confirm-dialog';
import { DisclosureSection } from './patterns/disclosure-section';
import { EmptyState } from './patterns/empty-state';
import { FilterBar } from './patterns/filter-bar';
import { Hero } from './patterns/hero';
import { ImagePreview } from './patterns/image-preview';
import { ImageUploadField } from './patterns/image-upload-field';
import { InspectorField } from './patterns/inspector-field';
import { List, ListRow, ListSection } from './patterns/list';
import { MessageBubble } from './patterns/message-bubble';
import { Notice } from './patterns/notice';
import { Panel } from './patterns/panel';
import { PostCard } from './patterns/post-card';
import { ProductCard } from './patterns/product-card';
import { ResponsivePanel } from './patterns/responsive-panel';
import { BarcodeScannerView, CameraPermissionView, ScanOverlay } from './patterns/scanner';
import { SectionHeader } from './patterns/section-header';
import { SelectableItem } from './patterns/selection';
import { SettingsRow } from './patterns/settings-row';
import { SwitchField } from './patterns/switch-field';
import { ThemeComposer } from './patterns/theme-composer';
import { PaletteItem, TileGrid } from './patterns/tile-grid';
import { Timeline } from './patterns/timeline';
import { TreeItem, TreeView } from './patterns/tree-view';
import { ZoraDrawerContent } from './patterns/zora-drawer-content';
import { ZoraTabBar } from './patterns/zora-tab-bar';

export type ZoraComponentRegistry = Readonly<Record<string, React.ElementType>>;

export const ZORA_COMPONENT_REGISTRY: ZoraComponentRegistry = {
  ActionSheet,
  ActionSheetItem,
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
  Drawer,
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
  Input,
  MediaCard,
  Menu,
  MetricCard,
  Modal,
  NavigationItem,
  NavigationList,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Rating,
  SearchBar,
  Select,
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
  SplashScreen,
  Tabs,
  Text,
  Textarea,
  TimePicker,
  Toast,
  Toolbar,
  ToolbarAction,
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
  DisclosureSection,
  EmptyState,
  FilterBar,
  Hero,
  ImagePreview,
  ImageUploadField,
  InspectorField,
  List,
  ListRow,
  ListSection,
  MessageBubble,
  Notice,
  Panel,
  PostCard,
  ProductCard,
  ResponsivePanel,
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
  ZoraDrawerContent,
  ZoraTabBar,
};
