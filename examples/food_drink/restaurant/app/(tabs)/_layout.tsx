import { Tabs } from 'expo-router';
import { ZoraTabBar, type ZoraNavigationRouteMap } from '@ankhorage/zora';

const routeMap: ZoraNavigationRouteMap = {
  index: { label: 'Home', icon: { name: 'restaurant-outline' } },
  menu: { label: 'Menu', icon: { name: 'book-outline' } },
  reservations: { label: 'Reserve', icon: { name: 'calendar-outline' } },
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
