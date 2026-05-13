import { Tabs } from 'expo-router';
import { ZoraTabBar, type ZoraNavigationRouteMap } from '@ankhorage/zora';

const routeMap: ZoraNavigationRouteMap = {
  index: { label: 'Home', icon: { name: 'home-outline' } },
  explore: { label: 'Explore', icon: { name: 'compass-outline' } },
  create: { label: 'Create', icon: { name: 'add-circle-outline' } },
  activity: { label: 'Activity', icon: { name: 'heart-outline' } },
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
