import { Tabs } from 'expo-router';
import { ZoraTabBar, type ZoraNavigationRouteMap } from '@ankhorage/zora';

const routeMap: ZoraNavigationRouteMap = {
  index: { label: 'Browse', icon: { name: 'storefront-outline' } },
  search: { label: 'Search', icon: { name: 'search-outline' } },
  sell: { label: 'Sell', icon: { name: 'add-circle-outline' } },
  orders: { label: 'Orders', icon: { name: 'receipt-outline' } },
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
