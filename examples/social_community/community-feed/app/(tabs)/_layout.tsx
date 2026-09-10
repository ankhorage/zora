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
        <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="newspaper-outline" />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="groups">
        <NativeTabs.Trigger.Label>Groups</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="people-outline" />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Label>Messages</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon
              family={NativeIoniconsFamily}
              name="chatbubble-outline"
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
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="settings-outline" />
          }
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
