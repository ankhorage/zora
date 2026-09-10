import { NativeIoniconsFamily } from '@ankhorage/navigator/tabs/native-icons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export const unstable_settings = { initialRouteName: 'index' };

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon
              family={NativeIoniconsFamily}
              name="restaurant-outline"
            />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="menu">
        <NativeTabs.Trigger.Label>Menu</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="book-outline" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reservations">
        <NativeTabs.Trigger.Label>Reserve</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="calendar-outline" />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="receipt-outline" />
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
