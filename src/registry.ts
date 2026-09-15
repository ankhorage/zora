import type { InteractionPolicyProps } from '@ankhorage/surface';
import type React from 'react';

import { Accordion, AccordionItem } from './features/accordion/public';
import { ActivityIndicator } from './features/activity-indicator/public';
import { AppBar } from './features/app-bar/public';
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
import { Breadcrumbs } from './features/breadcrumbs/public';
import { Button } from './features/button/public';
import { ButtonGroup } from './features/button/public';
import { IconButton } from './features/button/public';
import { Card } from './features/card/public';
import { MediaCard } from './features/card/public';
import { MetricCard } from './features/card/public';
import { PostCard } from './features/card/public';
import { ProductCard } from './features/card/public';
import { ChatListItem, MessageBubble } from './features/chat/public';
import { Chip } from './features/chip/public';
import { ChipGroup } from './features/chip/public';
import { CollectionEditor } from './features/collection-editor/public';
import { ContentRail } from './features/content-rail/public';
import { DataTable } from './features/data-table/public';
import { DatePicker } from './features/date-picker/public';
import { Dialog } from './features/dialog/public';
import { EmptyState } from './features/empty-state/public';
import { Checkbox, CheckboxGroup } from './features/form/checkbox/public';
import { Field, Form, FormActions, FormError } from './features/form/public';
import { Radio, RadioGroup } from './features/form/radio/public';
import { SearchInput } from './features/form/search-input/public';
import { Select } from './features/form/select/public';
import { Switch } from './features/form/switch/public';
import { TextInput } from './features/form/text-input/public';
import { Gradient } from './features/gradient/public';
import { Hero } from './features/hero/public';
import { Icon } from './features/icon/public';
import { Image } from './features/image/public';
import { KeyboardAvoidingView } from './features/keyboard-avoiding-view/public';
import { AppShell, Divider, Grid, Screen, ScrollView, View } from './features/layout/public';
import { FlatList, SectionList } from './features/list/public';
import { List, ListItem, ListSection } from './features/list/public';
import { MissingElement } from './features/missing-element/public';
import { Pagination } from './features/pagination/public';
import { PaletteItem } from './features/palette-item/public';
import { PopoverMenu } from './features/popover-menu/public';
import { Progress, ProgressRing } from './features/progress/public';
import { Rating } from './features/rating/public';
import { ReaderSurface } from './features/reader/public';
import { BarcodeScannerView, CameraPermissionView, ScanOverlay } from './features/scanner/public';
import { ScreenSection, SectionHeader } from './features/section/public';
import { SelectableItem } from './features/selection/public';
import { Skeleton, SkeletonCard, SkeletonList, SkeletonText } from './features/skeleton/public';
import { Surface } from './features/surface/public';
import { Tab, TabList, TabPanel, Tabs } from './features/tabs/public';
import { TimePicker } from './features/time-picker/public';
import { Timeline } from './features/timeline/public';
import { Toast } from './features/toast/public';
import { Toolbar } from './features/toolbar/public';
import { TreeItem, TreeView } from './features/tree-view/public';
import { Heading } from './features/typography/public';
import { Text } from './features/typography/public';
import { Uploader } from './features/uploader/public';
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
  Dialog,
  Form,
  FormActions,
  FormError,
  Field,
  Gradient,
  Heading,
  Icon,
  IconButton,
  Image,
  KeyboardAvoidingView,
  TextInput,
  MediaCard,
  MetricCard,
  Pagination,
  PopoverMenu,
  Progress,
  ProgressRing,
  Radio,
  RadioGroup,
  Rating,
  SearchInput,
  Select,
  Switch,
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TimePicker,
  Toast,
  Toolbar,
  Uploader,
  BottomSheet,
  FlatList,
  SectionList,
  ScrollView,
  View,
  ThemeModeToggle,
  Divider,
  Grid,
  Surface,
  AppShell,
  Screen,
  ScreenSection,
  ForgotPasswordForm,
  OAuthProviderButton,
  OAuthProviderList,
  OtpForm,
  SignInForm,
  SignUpForm,
  ChatListItem,
  CollectionEditor,
  ContentRail,
  EmptyState,
  Hero,
  List,
  ListItem,
  ListSection,
  MessageBubble,
  MissingElement,
  PostCard,
  ProductCard,
  ReaderSurface,
  BarcodeScannerView,
  CameraPermissionView,
  ScanOverlay,
  SectionHeader,
  SelectableItem,
  PaletteItem,
  Timeline,
  TreeItem,
  TreeView,
} as const satisfies ZoraComponentRegistry;

export const ZORA_COMPONENT_REGISTRY: ZoraComponentRegistry = _ZORA_COMPONENT_REGISTRY;
