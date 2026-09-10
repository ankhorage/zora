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
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="home-outline" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="products">
        <NativeTabs.Trigger.Label>Products</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="grid-outline" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cart">
        <NativeTabs.Trigger.Label>Cart</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={NativeIoniconsFamily} name="cart-outline" />}
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
