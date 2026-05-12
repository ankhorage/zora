import { type ZoraNavigationRouteMap, ZoraTabBar } from '@ankhorage/zora';
import { Tabs } from 'expo-router';

const routeMap: ZoraNavigationRouteMap = {
  index: { label: 'Feed', icon: { name: 'newspaper-outline' } },
  groups: { label: 'Groups', icon: { name: 'people-outline' } },
  messages: { label: 'Messages', icon: { name: 'chatbubble-outline' } },
  profile: { label: 'Profile', icon: { name: 'person-outline' } },
  settings: { label: 'Settings', icon: { name: 'settings-outline' } },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <ZoraTabBar {...props} routeMap={routeMap} />}
    />
  );
}
