import { Tabs } from 'expo-router';
import { ZoraTabBar, type ZoraNavigationRouteMap } from '@ankhorage/zora';

const routeMap: ZoraNavigationRouteMap = {
  index: { label: 'Home', icon: { name: 'home-outline' } },
  products: { label: 'Products', icon: { name: 'grid-outline' } },
  cart: { label: 'Cart', icon: { name: 'cart-outline' } },
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
