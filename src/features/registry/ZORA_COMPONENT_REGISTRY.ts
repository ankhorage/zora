import type { InteractionPolicyProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraComponentRegistry } from '../../types/registry';
import { Accordion, AccordionItem } from '../accordion/public';
import { ActivityIndicator } from '../activity-indicator/public';
import { AppBar } from '../app-bar/public';
import {
  ForgotPasswordForm,
  OAuthProviderButton,
  OAuthProviderList,
  OtpForm,
  SignInForm,
  SignUpForm,
} from '../auth/public';
import { Avatar, AvatarGroup } from '../avatar/public';
import { Badge } from '../badge/public';
import { BottomSheet } from '../bottom-sheet/public';
import { Breadcrumbs } from '../breadcrumbs/public';
import { Button, ButtonGroup, IconButton } from '../button/public';
import { Card, MediaCard, MetricCard, PostCard, ProductCard } from '../card/public';
import { ChatListItem, MessageBubble } from '../chat/public';
import { Chip, ChipGroup } from '../chip/public';
import { CollectionEditor } from '../collection-editor/public';
import { ContentRail } from '../content-rail/public';
import { DataTable } from '../data-table/public';
import { DatePicker } from '../date-picker/public';
import { Dialog } from '../dialog/public';
import { EmptyState } from '../empty-state/public';
import { Checkbox, CheckboxGroup } from '../form/checkbox/public';
import { Field, Form, FormActions, FormError } from '../form/public';
import { Radio, RadioGroup } from '../form/radio/public';
import { SearchInput } from '../form/search-input/public';
import { Select } from '../form/select/public';
import { Switch } from '../form/switch/public';
import { TextInput } from '../form/text-input/public';
import { Gradient } from '../gradient/public';
import { Hero } from '../hero/public';
import { Icon } from '../icon/public';
import { Image } from '../image/public';
import { KeyboardAvoidingView } from '../keyboard-avoiding-view/public';
import { AppShell, Divider, Grid, Screen, ScrollView, View } from '../layout/public';
import { FlatList, List, ListItem, ListSection, SectionList } from '../list/public';
import { MissingElement } from '../missing-element/public';
import { Pagination } from '../pagination/public';
import { PaletteItem } from '../palette-item/public';
import { PopoverMenu } from '../popover-menu/public';
import { Progress, ProgressRing } from '../progress/public';
import { Rating } from '../rating/public';
import { ReaderSurface } from '../reader/public';
import { BarcodeScannerView, CameraPermissionView, ScanOverlay } from '../scanner/public';
import { ScreenSection, SectionHeader } from '../section/public';
import { SelectableItem } from '../selection/public';
import { Skeleton, SkeletonCard, SkeletonList, SkeletonText } from '../skeleton/public';
import { Surface } from '../surface/public';
import { Tab, TabList, TabPanel, Tabs } from '../tabs/public';
import { ThemeModeToggle } from '../theme/adapters/inbound/ThemeModeToggle';
import { TimePicker } from '../time-picker/public';
import { Timeline } from '../timeline/public';
import { Toast } from '../toast/public';
import { Toolbar } from '../toolbar/public';
import { TreeItem, TreeView } from '../tree-view/public';
import { Heading, Text } from '../typography/public';
import { Uploader } from '../uploader/public';

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
