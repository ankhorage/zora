import { type ZoraNavigationRouteMap, ZoraTabBar } from '@ankhorage/zora';
import { Tabs } from 'expo-router';

const routeMap: ZoraNavigationRouteMap = {
  index: { label: 'Discover', icon: { name: 'sparkles-outline' } },
  boards: { label: 'Boards', icon: { name: 'albums-outline' } },
  saved: { label: 'Saved', icon: { name: 'bookmark-outline' } },
  trends: { label: 'Trends', icon: { name: 'trending-up-outline' } },
  profile: { label: 'Profile', icon: { name: 'person-outline' } },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <ZoraTabBar {...props} routeMap={routeMap} />}
    />
  );
}
