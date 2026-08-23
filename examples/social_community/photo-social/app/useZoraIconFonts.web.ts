import fontAwesome from '@react-native-vector-icons/fontawesome/fonts/FontAwesome.ttf';
import fontAwesome5Brands from '@react-native-vector-icons/fontawesome5/fonts/FontAwesome5_Brands.ttf';
import fontAwesome5Solid from '@react-native-vector-icons/fontawesome5/fonts/FontAwesome5_Solid.ttf';
import fontAwesome6Brands from '@react-native-vector-icons/fontawesome6/fonts/FontAwesome6_Brands.ttf';
import ionicons from '@react-native-vector-icons/ionicons/fonts/Ionicons.ttf';
import { useFonts } from 'expo-font';

const ZORA_ICON_FONTS = {
  FontAwesome: fontAwesome,
  'FontAwesome5Brands-Regular': fontAwesome5Brands,
  'FontAwesome5Free-Solid': fontAwesome5Solid,
  'FontAwesome6Brands-Regular': fontAwesome6Brands,
  Ionicons: ionicons,
} as const;

export function useZoraIconFonts(): boolean {
  const [loaded, error] = useFonts(ZORA_ICON_FONTS);

  if (error) {
    throw error;
  }

  return loaded;
}
