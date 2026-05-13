import { type ZoraNavigationRouteMap, ZoraTabBar } from '@ankhorage/zora';
import { Tabs } from 'expo-router';

const routeMap: ZoraNavigationRouteMap = {
  index: { label: 'Chats', icon: { name: 'chatbubbles-outline' } },
  calls: { label: 'Calls', icon: { name: 'call-outline' } },
  status: { label: 'Status', icon: { name: 'ellipse-outline' } },
  contacts: { label: 'Contacts', icon: { name: 'people-outline' } },
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
