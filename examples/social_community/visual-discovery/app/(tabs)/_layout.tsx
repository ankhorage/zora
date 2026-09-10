import { NativeIoniconsFamily as NativeIoniconsFamilyRuntime } from '@ankhorage/navigator/tabs/native-icons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

const NativeIoniconsFamily =
  Platform.OS === 'web'
    ? { getImageSource: () => Promise.resolve(null) }
    : NativeIoniconsFamilyRuntime;

export const unstable_settings = { initialRouteName: 'index' };

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Discover</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="sparkles-outline" />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="boards">
        <NativeTabs.Trigger.Label>Boards</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="albums-outline" />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="saved">
        <NativeTabs.Trigger.Label>Saved</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="bookmark-outline" />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="trends">
        <NativeTabs.Trigger.Label>Trends</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon
              family={NativeIoniconsFamily}
              name="trending-up-outline"
            />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="person-outline" />
          }
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
